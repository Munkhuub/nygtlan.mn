import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticationMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  try {
    const { userId } = jwt.verify(token, jwtSecret) as {
      userId?: number;
    };
    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
