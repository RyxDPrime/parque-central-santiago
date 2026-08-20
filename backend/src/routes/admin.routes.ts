import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { permisosDe } from "../config/permisos";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { loginLimiter } from "../middleware/rateLimit";

export const adminRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

adminRouter.post("/admin/login", loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const usuario = await prisma.usuario.findUnique({
      where: { usuario: username.trim().toLowerCase() },
    });

    // El mismo mensaje si no existe, si está de baja o si la clave no coincide:
    // decir cuál de las tres falló le confirmaría a un extraño qué usuarios hay.
    const clave = usuario?.activo ? await bcrypt.compare(password, usuario.passwordHash) : false;
    if (!usuario || !clave) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    const token = jwt.sign(
      { id: usuario.id, usuario: usuario.usuario, rol: usuario.rol },
      env.jwtSecret,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        rol: usuario.rol,
        permisos: permisosDe(usuario.rol),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Quién soy y qué puedo hacer. El panel lo consulta al cargar, para no fiarse
 * de lo que quedó guardado en el navegador: si a alguien le cambian el rol,
 * el cambio se nota en cuanto recarga.
 */
adminRouter.get("/admin/yo", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const actual = await prisma.usuario.findUnique({ where: { id: req.usuario!.id } });
    if (!actual || !actual.activo) {
      res.status(401).json({ error: "Tu cuenta ya no está activa" });
      return;
    }
    res.json({
      id: actual.id,
      nombre: actual.nombre,
      usuario: actual.usuario,
      rol: actual.rol,
      permisos: permisosDe(actual.rol),
    });
  } catch (err) {
    next(err);
  }
});

const cambioClaveSchema = z.object({
  actual: z.string().min(1),
  nueva: z.string().min(8, "La contraseña nueva debe tener al menos 8 caracteres"),
});

/** Cambiar la propia contraseña. No hace falta ningún permiso especial. */
adminRouter.post("/admin/cambiar-clave", requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { actual, nueva } = cambioClaveSchema.parse(req.body);
    const yo = await prisma.usuario.findUnique({ where: { id: req.usuario!.id } });

    if (!yo || !(await bcrypt.compare(actual, yo.passwordHash))) {
      res.status(400).json({ error: "La contraseña actual no es correcta" });
      return;
    }

    await prisma.usuario.update({
      where: { id: yo.id },
      data: { passwordHash: await bcrypt.hash(nueva, 10) },
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
