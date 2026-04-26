import { Request, Response } from "express";
import { prisma } from "../../db";

export const getJournalEntryById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const entryId = parseInt(req.params.entryId);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  if (isNaN(companyId) || isNaN(entryId)) {
    return res.status(400).json({
      message: "Invalid company or entry ID",
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

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        companyId,
      },
      include: {
        lines: {
          include: {
            account: true,
          },
          orderBy: { lineOrder: "asc" },
        },
      },
    });

    if (!entry) {
      return res.status(404).json({
        message: "Journal entry not found",
        error: "ENTRY_NOT_FOUND",
      });
    }

    return res.status(200).json({
      message: "Journal entry fetched successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Get journal entry error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
