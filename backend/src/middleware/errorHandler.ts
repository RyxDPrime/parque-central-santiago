import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Recurso no encontrado" });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Datos inválidos", details: err.flatten() });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Registro no encontrado" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ error: "Ya existe un registro con ese valor" });
      return;
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: "Faltan datos requeridos o tienen un formato inválido" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}
