import { Request, Response } from "express";
import { prisma } from "../../db";

export const updateCompany = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.id);
  const { name, taxId, address, phone, email, fiscalYearStart, baseCurrency } =
    req.body;

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
    const existingCompany = await prisma.company.findFirst({
      where: { id: companyId, userId },
    });

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found or access denied",
        error: "COMPANY_NOT_FOUND",
      });
    }

    if (taxId && taxId !== existingCompany.taxId) {
      const duplicateTaxId = await prisma.company.findFirst({
        where: {
          taxId,
          id: { not: companyId },
        },
      });

      if (duplicateTaxId) {
        return res.status(409).json({
          message: "Tax ID already exists",
          error: "DUPLICATE_TAX_ID",
        });
      }
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        taxId,
        address,
        phone,
        email,
        fiscalYearStart,
        baseCurrency,
      },
    });

    return res.status(200).json({
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
