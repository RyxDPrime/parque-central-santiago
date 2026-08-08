import { Router } from "express";
import { prisma } from "../config/db";
import { sendContactNotification } from "../config/mailer";
import { contactoLimiter } from "../middleware/rateLimit";
import { contactoSchema } from "../schemas/contacto.schema";

export const contactoRouter = Router();

contactoRouter.post("/contacto", contactoLimiter, async (req, res, next) => {
  try {
    const input = contactoSchema.parse(req.body);

    const message = await prisma.contactMessage.create({ data: input });

    try {
      await sendContactNotification(input);
      await prisma.contactMessage.update({
        where: { id: message.id },
        data: { emailEnviado: true },
      });
    } catch (mailErr) {
      // El mensaje ya quedó guardado en la base de datos aunque el correo falle;
      // no se bloquea la respuesta al visitante por un problema de SMTP.
      console.error("No se pudo enviar el correo de contacto:", mailErr);
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});
