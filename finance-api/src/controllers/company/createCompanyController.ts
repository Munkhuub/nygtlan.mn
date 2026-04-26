import { Request, Response } from "express";
import { prisma } from "../../db";
import { loadDefaultAccountsForCompany } from "../../lib/default-mongolian-accounts";

export const createCompany = async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    name,
    taxId,
    address,
    phone,
    email,
    fiscalYearStart,
    baseCurrency,
    loadDefaultAccounts = true,
  } = req.body;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthenticated",
      error: "UNAUTHENTICATED",
    });
  }

  if (!name) {
    return res.status(400).json({
      message: "Company name is required",
      error: "MISSING_COMPANY_NAME",
    });
  }

  try {
    if (taxId) {
      const existingCompany = await prisma.company.findUnique({
        where: { taxId },
      });

      if (existingCompany) {
        return res.status(409).json({
          message: "Tax ID already registered",
          error: "DUPLICATE_TAX_ID",
        });
      }
    }

    const { company, defaultAccounts } = await prisma.$transaction(async (tx) => {
      const createdCompany = await tx.company.create({
        data: {
          name,
          taxId,
          address,
          phone,
          email,
          fiscalYearStart: fiscalYearStart || 1,
          baseCurrency: baseCurrency || "MNT",
          userId,
        },
      });

      const defaultAccountResult =
        loadDefaultAccounts === false
          ? null
          : await loadDefaultAccountsForCompany(tx, createdCompany.id);

      return {
        company: createdCompany,
        defaultAccounts: defaultAccountResult,
      };
    });

    return res.status(201).json({
      message: "Company created successfully",
      data: {
        ...company,
        defaultAccounts,
      },
    });
  } catch (error) {
    console.error("Create company error:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "Company with this tax ID already exists",
          error: "DUPLICATE_COMPANY",
        });
      }
    }

    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
