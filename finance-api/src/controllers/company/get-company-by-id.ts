import { Request, Response } from "express";
import { prisma } from "../../db";

export const getCompanyById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.id);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  if (isNaN(companyId)) {
    return res.status(400).json({
      message: "Invalid company ID",
      error: "INVALID_ID",
    });
  }

  try {
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        userId,
      },
      include: {
        accounts: {
          where: { isActive: true },
          orderBy: { code: "asc" },
        },
        _count: {
          select: {
            journalEntries: true,
            accountingPeriods: true,
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        error: "COMPANY_NOT_FOUND",
      });
    }

    return res.status(200).json({
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    console.error("Get company error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
