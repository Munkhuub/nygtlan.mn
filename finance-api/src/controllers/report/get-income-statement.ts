import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db";

type IncomeStatementAccount = Prisma.AccountGetPayload<{
  include: { journalLines: true };
}>;

export const getIncomeStatement = async (req: Request, res: Response) => {
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

    const start = startDate
      ? new Date(startDate as string)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    const accounts = (await prisma.account.findMany({
      where: {
        companyId,
        isActive: true,
        type: {
          in: ["REVENUE", "EXPENSE", "COST_OF_GOODS_SOLD"],
        },
      },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              status: "POSTED",
              date: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      },
      orderBy: { code: "asc" },
    })) as IncomeStatementAccount[];

    const incomeStatement = {
      revenue: [] as any[],
      costOfGoodsSold: [] as any[],
      expenses: [] as any[],
      totalRevenue: 0,
      totalCOGS: 0,
      totalExpenses: 0,
      grossProfit: 0,
      netIncome: 0,
      period: {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      },
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
        case "REVENUE":
          incomeStatement.revenue.push(item);
          incomeStatement.totalRevenue += balance;
          break;
        case "COST_OF_GOODS_SOLD":
          incomeStatement.costOfGoodsSold.push(item);
          incomeStatement.totalCOGS += balance;
          break;
        case "EXPENSE":
          incomeStatement.expenses.push(item);
          incomeStatement.totalExpenses += balance;
          break;
      }
    });

    incomeStatement.grossProfit =
      incomeStatement.totalRevenue - incomeStatement.totalCOGS;
    incomeStatement.netIncome =
      incomeStatement.grossProfit - incomeStatement.totalExpenses;

    return res.status(200).json({
      message: "Income statement fetched successfully",
      data: incomeStatement,
    });
  } catch (error) {
    console.error("Get income statement error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
