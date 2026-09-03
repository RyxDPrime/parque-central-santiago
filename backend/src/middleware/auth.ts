import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
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

/**
 * Comprueba la sesión en cada petición, contra la base y no solo contra el
 * token.
 *
 * El token vale siete días y no se puede retirar una vez firmado, así que
 * fiarse de lo que dice significaba que dar de baja a alguien —o bajarle el
 * rol— no surtía efecto hasta que su token caducara: durante una semana seguía
 * escribiendo con los permisos de antes. Quien conserve el token de una cuenta
 * cerrada no debería poder tocar nada al minuto siguiente de cerrarla.
 *
 * El precio es una consulta por petición, y es un precio bajo: esto solo cubre
 * el panel, que lo usan unas pocas personas del Parque. Lo público no pasa por
 * aquí.
 *
 * El rol se toma también de la base: es la respuesta a "qué puede hacer ahora",
 * no "qué podía hacer cuando entró".
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  let datos: Partial<Credencial>;
  try {
    datos = jwt.verify(token, env.jwtSecret) as Partial<Credencial>;
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada" });
    return;
  }

  if (typeof datos.id !== "number") {
    // Token de la época de la credencial compartida: no dice quién es.
    res.status(401).json({ error: "Vuelve a iniciar sesión" });
    return;
  }

  try {
    const actual = await prisma.usuario.findUnique({ where: { id: datos.id } });

    // Da igual si la cuenta se borró o si solo se dio de baja: en los dos casos
    // dejó de valer, y el panel tiene que sacar a esa sesión.
    if (!actual || !actual.activo) {
      res.status(401).json({ error: "Tu cuenta ya no está activa" });
      return;
    }

    req.usuario = { id: actual.id, usuario: actual.usuario, rol: actual.rol };
    next();
  } catch (err) {
    // Si la base no responde, no se deja pasar: sin poder comprobar quién es,
    // la alternativa seria confiar en el token, que es justo lo que se quiso
    // dejar de hacer.
    next(err);
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
