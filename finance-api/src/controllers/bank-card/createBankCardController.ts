import { prisma } from "../../db";
import { Request, Response } from "express";

const createBankCardController = async (req: Request, res: Response) => {
  const { country, firstname, lastname, cardNumber, expiryDate, userId, cvc } =
    req.body;

  try {
    const BankCard = await prisma.bankCard.create({
      data: {
        country,
        firstname,
        lastname,
        cardNumber,
        expiryDate,
        cvc,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return res
      .status(200)
      .json({ message: "Bank card information created succesfully", BankCard });
  } catch (error) {
    console.error("Create bank card info", error);
  }
};

export default createBankCardController;
