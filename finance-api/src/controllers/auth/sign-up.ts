import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../db";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, phone, avatar } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required",
      error: "MISSING_FIELDS",
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          message: "Email already registered",
          error: "DUPLICATE_EMAIL",
        });
      }
      if (existingUser.username === username) {
        return res.status(409).json({
          message: "Username already taken",
          error: "DUPLICATE_USERNAME",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
        avatar,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set");
      return res.status(500).json({
        message: "Server configuration error",
        error: "MISSING_JWT_SECRET",
      });
    }

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      jwtSecret,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "Sign up successful",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "Email or username already exists",
        error: "DUPLICATE_USER",
      });
    }

    return res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
