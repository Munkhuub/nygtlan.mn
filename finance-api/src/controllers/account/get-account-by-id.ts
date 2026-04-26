import { Request, Response } from "express";
import { prisma } from "../../db";

export const getAccountById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const accountId = parseInt(req.params.accountId);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  if (isNaN(companyId) || isNaN(accountId)) {
    return res.status(400).json({
      message: "Invalid company or account ID",
      error: "INVALID_ID",
    });
  }

  try {
    const company = await prisma.company.findFirst({
      where: { id: companyId, userId },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or access denied",
        error: "COMPANY_NOT_FOUND",
      });
    }

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        companyId,
      },
      include: {
        parent: true,
        children: true,
        journalLines: {
          include: {
            journalEntry: {
              select: {
                id: true,
                entryNumber: true,
                date: true,
                description: true,
              },
            },
          },
          take: 10,
          orderBy: {
            journalEntry: {
              date: "desc",
            },
          },
        },
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
        error: "ACCOUNT_NOT_FOUND",
      });
    }

    return res.status(200).json({
      message: "Account fetched successfully",
      data: account,
    });
  } catch (error) {
    console.error("Get account error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
