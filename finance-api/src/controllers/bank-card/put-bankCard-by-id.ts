import { prisma } from "../../db";
import { Request, Response } from "express";

export const updateBankCardById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { country, firstname, lastname, cardNumber, expiryDate, cvc } =
    req.body;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid or missing id parameter" });
  }

  try {
    const updatedBankCard = await prisma.bankCard.update({
      where: { id: Number(id) },
      data: {
        country,
        firstname,
        lastname,
        cardNumber,
        expiryDate,
        cvc,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ bankCard: updatedBankCard });
  } catch (error) {
    console.error("Error updating bank card:", error);
    res.status(500).json({ message: "Server error" });
  }
};
