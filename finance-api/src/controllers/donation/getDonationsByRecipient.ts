import { prisma } from "../../db";
import { Request, Response } from "express";

export const getDonationsByRecipient = async (req: Request, res: Response) => {
  const recipientId = parseInt(req.params.userId);

  try {
    const donations = await prisma.donation.findMany({
      where: { recipientId },
      include: {
        donor: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
