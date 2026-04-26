import { Request, Response } from "express";
import { prisma } from "../../db";

export const createAccount = async (req: Request, res: Response) => {
  const userId = req.userId;
  const companyId = parseInt(req.params.companyId);
  const {
    code,
    name,
    type,
    normalSide,
    parentId,
    level,
    description,
    isTaxAccount,
  } = req.body;

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

    if (!code || !name || !type || !normalSide) {
      return res.status(400).json({
        message: "Required fields: code, name, type, normalSide",
        error: "MISSING_REQUIRED_FIELDS",
      });
    }

    const existingAccount = await prisma.account.findUnique({
      where: {
        code_companyId: {
          code,
          companyId,
        },
      },
    });

    if (existingAccount) {
      return res.status(409).json({
        message: "Account code already exists in this company",
        error: "DUPLICATE_ACCOUNT_CODE",
      });
    }

    if (parentId) {
      const parentAccount = await prisma.account.findFirst({
        where: {
          id: parentId,
          companyId,
        },
      });

      if (!parentAccount) {
        return res.status(400).json({
          message: "Parent account not found",
          error: "INVALID_PARENT",
        });
      }
    }

    const account = await prisma.account.create({
      data: {
        code,
        name,
        type,
        normalSide,
        parentId,
        level: level || 0,
        description,
        isTaxAccount: isTaxAccount || false,
        companyId,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: account,
    });
  } catch (error) {
    console.error("Create account error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
