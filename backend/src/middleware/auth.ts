import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthedRequest extends Request {
  isAdmin?: boolean;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    jwt.verify(token, env.jwtSecret);
    req.isAdmin = true;
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}
