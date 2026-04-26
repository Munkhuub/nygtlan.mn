import { Request, Response } from "express";
import { prisma } from "../../db";

export const getTrialBalance = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const { startDate, endDate } = req.query;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  if (isNaN(companyId)) {
    return res.status(400).json({
      message: "Invalid company ID",
      error: "INVALID_COMPANY_ID",
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

    const accounts = await prisma.account.findMany({
      where: { companyId, isActive: true },
      orderBy: { code: "asc" },
    });

    const journalWhere: any = {
      companyId,
      status: "POSTED",
    };

    if (startDate && endDate) {
      journalWhere.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const journalLines = await prisma.journalLine.findMany({
      where: {
        journalEntry: journalWhere,
      },
      include: {
        account: true,
      },
    });

    const trialBalance = accounts.map((account) => {
      const lines = journalLines.filter(
        (line) => line.accountId === account.id,
      );

      const totalDebit = lines.reduce(
        (sum, line) => sum + Number(line.debit),
        0,
      );
      const totalCredit = lines.reduce(
        (sum, line) => sum + Number(line.credit),
        0,
      );

      let balance = 0;
      if (account.normalSide === "DEBIT") {
        balance = totalDebit - totalCredit;
      } else {
        balance = totalCredit - totalDebit;
      }

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        normalSide: account.normalSide,
        level: account.level,
        debit: totalDebit,
        credit: totalCredit,
        balance: balance,
      };
    });

    const activeAccounts = trialBalance.filter(
      (acc) => acc.debit > 0 || acc.credit > 0,
    );

    const totals = {
      debit: activeAccounts.reduce((sum, acc) => sum + acc.debit, 0),
      credit: activeAccounts.reduce((sum, acc) => sum + acc.credit, 0),
      balanced:
        Math.abs(
          activeAccounts.reduce((sum, acc) => sum + acc.debit, 0) -
            activeAccounts.reduce((sum, acc) => sum + acc.credit, 0),
        ) < 0.01,
    };

    return res.status(200).json({
      message: "Trial balance fetched successfully",
      data: {
        accounts: activeAccounts,
        totals,
        period: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
    });
  } catch (error) {
    console.error("Get trial balance error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
