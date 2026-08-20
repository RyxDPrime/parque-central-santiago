import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/db";
import { ROLES } from "../config/permisos";
import { requireAuth, requirePermiso, type AuthedRequest } from "../middleware/auth";

export const usuariosRouter = Router();

// Todo lo de aquí exige el permiso de usuarios, que solo tiene el administrador.
usuariosRouter.use("/usuarios", requireAuth, requirePermiso("usuarios"));

/** Nunca se devuelve el hash de la contraseña, ni siquiera al administrador. */
const CAMPOS = {
  id: true,
  nombre: true,
  usuario: true,
  email: true,
  rol: true,
  activo: true,
  ultimoAcceso: true,
  createdAt: true,
} as const;

const nuevoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es muy corto").max(120),
  usuario: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "El usuario es muy corto")
    .max(40)
    .regex(/^[a-z0-9._-]+$/, "Solo letras, números, punto, guion y guion bajo"),
  email: z.string().trim().email("Correo inválido").max(200).optional().or(z.literal("")),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(ROLES),
});

const cambioSchema = z.object({
  nombre: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email("Correo inválido").max(200).optional().or(z.literal("")),
  rol: z.enum(ROLES).optional(),
  activo: z.boolean().optional(),
  // Solo si se quiere restablecer; si no viene, la contraseña no se toca.
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
});

/** Cuántos administradores activos quedan aparte de uno dado. */
async function otrosAdminsActivos(exceptoId: number): Promise<number> {
  return prisma.usuario.count({
    where: { rol: "admin", activo: true, id: { not: exceptoId } },
  });
}

usuariosRouter.get("/usuarios", async (_req, res, next) => {
  try {
    res.json(await prisma.usuario.findMany({ select: CAMPOS, orderBy: { nombre: "asc" } }));
  } catch (err) {
    next(err);
  }
});

usuariosRouter.post("/usuarios", async (req, res, next) => {
  try {
    const datos = nuevoSchema.parse(req.body);

    const repetido = await prisma.usuario.findUnique({ where: { usuario: datos.usuario } });
    if (repetido) {
      res.status(409).json({ error: "Ya existe un usuario con ese nombre de acceso" });
      return;
    }

    const creado = await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        usuario: datos.usuario,
        email: datos.email || null,
        rol: datos.rol,
        passwordHash: await bcrypt.hash(datos.password, 10),
      },
      select: CAMPOS,
    });
    res.status(201).json(creado);
  } catch (err) {
    next(err);
  }
});

usuariosRouter.put("/usuarios/:id", async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const datos = cambioSchema.parse(req.body);
    const actual = await prisma.usuario.findUnique({ where: { id } });

    if (!actual) {
      res.status(404).json({ error: "Ese usuario no existe" });
      return;
    }

    // Nadie puede quitarse a sí mismo el rol de administrador ni darse de baja:
    // es la forma más fácil de quedarse fuera del panel sin querer.
    const seDegrada = datos.rol && datos.rol !== "admin" && actual.rol === "admin";
    const seDesactiva = datos.activo === false && actual.activo;

    if (req.usuario!.id === id && (seDegrada || seDesactiva)) {
      res.status(400).json({ error: "No puedes quitarte a ti mismo el acceso de administrador" });
      return;
    }

    // Y el sistema no puede quedarse sin ningún administrador activo.
    if ((seDegrada || seDesactiva) && (await otrosAdminsActivos(id)) === 0) {
      res.status(400).json({ error: "Debe quedar al menos un administrador activo" });
      return;
    }

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        email: datos.email === "" ? null : datos.email,
        rol: datos.rol,
        activo: datos.activo,
        ...(datos.password ? { passwordHash: await bcrypt.hash(datos.password, 10) } : {}),
      },
      select: CAMPOS,
    });
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
});

usuariosRouter.delete("/usuarios/:id", async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);

    if (req.usuario!.id === id) {
      res.status(400).json({ error: "No puedes eliminar tu propia cuenta" });
      return;
    }

    const actual = await prisma.usuario.findUnique({ where: { id } });
    if (!actual) {
      res.status(404).json({ error: "Ese usuario no existe" });
      return;
    }

    if (actual.rol === "admin" && (await otrosAdminsActivos(id)) === 0) {
      res.status(400).json({ error: "Debe quedar al menos un administrador activo" });
      return;
    }

    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
