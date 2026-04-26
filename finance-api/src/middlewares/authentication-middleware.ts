import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Access token required",
      error: "UNAUTHENTICATED",
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({
      message: "Server configuration error",
      error: "JWT_SECRET_MISSING",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      role: string;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: "INVALID_TOKEN",
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({
        message: "Insufficient permissions",
        error: "FORBIDDEN",
      });
      return;
    }
    next();
  };
};
