import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db";

type BalanceSheetAccount = Prisma.AccountGetPayload<{
  include: { journalLines: true };
}>;

export const getBalanceSheet = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const { date } = req.query;

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

    const accounts = (await prisma.account.findMany({
      where: {
        companyId,
        isActive: true,
        type: {
          in: [
            "CURRENT_ASSET",
            "NON_CURRENT_ASSET",
            "CURRENT_LIABILITY",
            "NON_CURRENT_LIABILITY",
            "EQUITY",
          ],
        },
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              status: "POSTED",
              ...(date ? { date: { lte: new Date(date as string) } } : {}),
            },
          },
        },
      },
      orderBy: { code: "asc" },
    })) as BalanceSheetAccount[];

    const balanceSheet = {
      assets: {
        current: [] as any[],
        nonCurrent: [] as any[],
        total: 0,
      },
      liabilities: {
        current: [] as any[],
        nonCurrent: [] as any[],
        total: 0,
      },
      equity: {
        items: [] as any[],
        total: 0,
      },
      date: date || new Date().toISOString().split("T")[0],
    };

    accounts.forEach((account) => {
      const debit = account.journalLines.reduce(
        (sum: number, line) => sum + Number(line.debit),
        0,
      );
      const credit = account.journalLines.reduce(
        (sum: number, line) => sum + Number(line.credit),
        0,
      );

      const balance =
        account.normalSide === "DEBIT" ? debit - credit : credit - debit;

      if (balance === 0) return;

      const item = {
        id: account.id,
        code: account.code,
        name: account.name,
        balance: balance,
      };

      switch (account.type) {
        case "CURRENT_ASSET":
          balanceSheet.assets.current.push(item);
          balanceSheet.assets.total += balance;
          break;
        case "NON_CURRENT_ASSET":
          balanceSheet.assets.nonCurrent.push(item);
          balanceSheet.assets.total += balance;
          break;
        case "CURRENT_LIABILITY":
          balanceSheet.liabilities.current.push(item);
          balanceSheet.liabilities.total += balance;
          break;
        case "NON_CURRENT_LIABILITY":
          balanceSheet.liabilities.nonCurrent.push(item);
          balanceSheet.liabilities.total += balance;
          break;
        case "EQUITY":
          balanceSheet.equity.items.push(item);
          balanceSheet.equity.total += balance;
          break;
      }
    });

    const totalAssets = balanceSheet.assets.total;
    const totalLiabilitiesAndEquity =
      balanceSheet.liabilities.total + balanceSheet.equity.total;
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    return res.status(200).json({
      message: "Balance sheet fetched successfully",
      data: {
        ...balanceSheet,
        isBalanced,
        difference: totalAssets - totalLiabilitiesAndEquity,
      },
    });
  } catch (error) {
    console.error("Get balance sheet error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
