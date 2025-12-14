import { prisma } from "../../db";
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: Missing user ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        bankCard: true,
        receivedDonations: {
          include: {
            donor: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
