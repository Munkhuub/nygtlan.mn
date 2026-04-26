import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../db";
import { Request, Response } from "express";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      error: "MISSING_CREDENTIALS",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        companies: {
          select: {
            id: true,
            name: true,
            taxId: true,
          },
        },
      },
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: "Email or password invalid",
        error: "INVALID_CREDENTIALS",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log("Password mismatch");
      return res.status(401).json({
        message: "Email or password invalid",
        error: "INVALID_CREDENTIALS",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({
        message: "Server configuration error",
        error: "MISSING_JWT_SECRET",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" },
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Sign in successful",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
