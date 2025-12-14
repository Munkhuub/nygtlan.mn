import { RequestHandler } from "express";
import { prisma } from "../../db";

export const checkUsername: RequestHandler = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    if (!user) {
      res.status(200).json({ isExist: false });
      return;
    }
    res.status(200).json({ isExist: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
