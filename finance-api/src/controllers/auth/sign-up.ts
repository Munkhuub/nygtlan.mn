import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../db";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        profile: true,
        bankCard: true,
        sentDonations: {
          include: {
            recipient: {
              include: { profile: true },
            },
          },
        },
        receivedDonations: {
          include: {
            donor: {
              include: { profile: true },
            },
          },
        },
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      jwtSecret
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      user: userWithoutPassword,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    return res.status(500).json({
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
