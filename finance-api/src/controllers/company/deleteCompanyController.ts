import { Request, Response } from "express";
import { prisma } from "../../db";

export const deleteCompany = async (req: Request, res: Response) => {
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
      where: { id: companyId, userId },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found or access denied",
        error: "COMPANY_NOT_FOUND",
      });
    }

    await prisma.company.delete({
      where: { id: companyId },
    });

    return res.status(200).json({
      message: "Company deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete company error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
