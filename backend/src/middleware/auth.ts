import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { puede, type Permiso } from "../config/permisos";

export interface AuthedRequest extends Request {
  usuario?: { id: number; usuario: string; rol: string };
}

/** Lo que va firmado dentro del token. */
interface Credencial {
  id: number;
  usuario: string;
  rol: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const datos = jwt.verify(token, env.jwtSecret) as Partial<Credencial>;
    if (typeof datos.id !== "number" || typeof datos.rol !== "string") {
      // Token de la época de la credencial compartida: no dice quién es.
      res.status(401).json({ error: "Vuelve a iniciar sesión" });
      return;
    }
    req.usuario = { id: datos.id, usuario: datos.usuario ?? "", rol: datos.rol };
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}

/**
 * Exige un permiso concreto. Va siempre después de `requireAuth`.
 *
 * Responde 403 y no 401 a propósito: la sesión es válida, lo que falta es el
 * permiso. Con 401 el panel cerraría la sesión y la persona creería que su
 * contraseña dejó de servir.
 */
export function requirePermiso(permiso: Permiso) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }
    if (!puede(req.usuario.rol, permiso)) {
      res.status(403).json({ error: "Tu rol no permite esta acción" });
      return;
    }
    next();
  };
}
