import { Request, Response } from "express";
import { prisma } from "../../db";

export const getAccountLedger = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const accountId = parseInt(req.params.accountId);
  const { startDate, endDate, page = "1", limit = "50" } = req.query;

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
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        companyId,
        company: {
          userId,
        },
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found or access denied",
        error: "ACCOUNT_NOT_FOUND",
      });
    }

    const where: any = {
      accountId,
      journalEntry: {
        status: "POSTED",
      },
    };

    if (startDate && endDate) {
      where.journalEntry.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const [lines, total] = await Promise.all([
      prisma.journalLine.findMany({
        where,
        include: {
          journalEntry: {
            select: {
              id: true,
              entryNumber: true,
              date: true,
              description: true,
              reference: true,
            },
          },
        },
        orderBy: {
          journalEntry: {
            date: "asc",
          },
        },
        skip,
        take: limitNumber,
      }),
      prisma.journalLine.count({ where }),
    ]);

    let runningBalance = 0;
    const ledgerEntries = lines.map((line) => {
      const debit = Number(line.debit);
      const credit = Number(line.credit);

      if (account.normalSide === "DEBIT") {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }

      return {
        id: line.id,
        date: line.journalEntry.date,
        entryNumber: line.journalEntry.entryNumber,
        description: line.journalEntry.description,
        reference: line.journalEntry.reference,
        memo: line.memo,
        debit: debit,
        credit: credit,
        balance: runningBalance,
      };
    });

    return res.status(200).json({
      message: "Account ledger fetched successfully",
      data: {
        account: {
          id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          normalSide: account.normalSide,
        },
        entries: ledgerEntries,
        currentBalance: runningBalance,
      },
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get account ledger error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
