import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth, requirePermiso } from "../middleware/auth";

// Bandeja de mensajes del formulario de contacto. Es solo lectura (más borrar):
// los mensajes los crea el visitante desde la web pública, no el panel.
// Existe porque el envío del correo puede fallar sin bloquear al visitante,
// y en ese caso el mensaje quedaría únicamente guardado en la base de datos.
export const mensajesRouter = Router();

mensajesRouter.get("/mensajes", requireAuth, requirePermiso("comunicaciones"), async (_req, res, next) => {
  try {
    const mensajes = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(mensajes);
  } catch (err) {
    next(err);
  }
});

mensajesRouter.delete("/mensajes/:id", requireAuth, requirePermiso("comunicaciones"), async (req, res, next) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
