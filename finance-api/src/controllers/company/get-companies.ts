import { Request, Response } from "express";
import { prisma } from "../../db";

export const getCompanies = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  try {
    const companies = await prisma.company.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            accounts: true,
            journalEntries: true,
            accountingPeriods: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Companies fetched successfully",
      data: companies,
    });
  } catch (error) {
    console.error("Get companies error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
