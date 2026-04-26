import { Request, Response } from "express";
import { prisma } from "../../db";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

interface JournalLineInput {
  accountId: number;
  debit: number | string;
  credit: number | string;
  memo?: string;
  currency?: string;
  exchangeRate?: number;
}

export const createJournalEntry = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const { date, description, reference, lines, periodId } = req.body;

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

    if (!date || !description || !lines || !Array.isArray(lines)) {
      return res.status(400).json({
        message: "Required fields: date, description, lines (array)",
        error: "MISSING_REQUIRED_FIELDS",
      });
    }

    if (lines.length < 2) {
      return res.status(400).json({
        message: "At least 2 journal lines required",
        error: "INSUFFICIENT_LINES",
      });
    }

    const totalDebit = lines.reduce(
      (sum: number, line: JournalLineInput) =>
        sum + parseFloat(String(line.debit || 0)),
      0,
    );
    const totalCredit = lines.reduce(
      (sum: number, line: JournalLineInput) =>
        sum + parseFloat(String(line.credit || 0)),
      0,
    );

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({
        message: `Debits (${totalDebit}) and credits (${totalCredit}) must balance`,
        error: "UNBALANCED_ENTRY",
      });
    }

    const accountIds = lines.map((line: JournalLineInput) => line.accountId);
    const accounts = await prisma.account.findMany({
      where: {
        id: { in: accountIds },
        companyId,
        isActive: true,
      },
    });

    if (accounts.length !== accountIds.length) {
      return res.status(400).json({
        message: "One or more accounts not found",
        error: "INVALID_ACCOUNTS",
      });
    }

    const count = await prisma.journalEntry.count({
      where: { companyId },
    });
    const entryNumber = `JE-${new Date(date).getFullYear()}-${String(
      count + 1,
    ).padStart(4, "0")}`;

    const journalEntry = await prisma.journalEntry.create({
      data: {
        entryNumber,
        date: new Date(date),
        description,
        reference,
        status: "POSTED",
        companyId,
        periodId,
        createdById: userId,
        lines: {
          create: lines.map((line: JournalLineInput, index: number) => ({
            accountId: line.accountId,
            debit: new Decimal(line.debit || 0),
            credit: new Decimal(line.credit || 0),
            currency: line.currency || "MNT",
            exchangeRate: line.exchangeRate
              ? new Decimal(line.exchangeRate)
              : null,
            memo: line.memo,
            lineOrder: index,
          })) as Prisma.JournalLineCreateManyJournalEntryInput[],
        },
      },
      include: {
        lines: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
              },
            },
          },
          orderBy: { lineOrder: "asc" },
        },
      },
    });

    return res.status(201).json({
      message: "Journal entry created successfully",
      data: journalEntry,
    });
  } catch (error) {
    console.error("Create journal entry error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
