import { prisma } from "../../db";
import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: Missing user ID",
      error: "UNAUTHENTICATED",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
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
            address: true,
            phone: true,
            email: true,
            fiscalYearStart: true,
            baseCurrency: true,
            createdAt: true,
            _count: {
              select: {
                accounts: true,
                journalEntries: true,
                accountingPeriods: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
