import { Request, Response } from "express";
import { prisma } from "../../db";
import { loadDefaultAccountsForCompany } from "../../lib/default-mongolian-accounts";

export const loadDefaultAccounts = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);

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
      where: {
        id: companyId,
        userId,
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or access denied",
        error: "COMPANY_NOT_FOUND",
      });
    }

    const result = await loadDefaultAccountsForCompany(prisma, companyId);

    return res.status(200).json({
      message: "Default Mongolian chart of accounts loaded",
      data: result,
    });
  } catch (error) {
    console.error("Load default accounts error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
