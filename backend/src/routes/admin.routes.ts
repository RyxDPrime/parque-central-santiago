import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";

export const adminRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

adminRouter.post("/admin/login", async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const validUser = username === env.admin.username;
    const validPass = env.admin.passwordHash
      ? await bcrypt.compare(password, env.admin.passwordHash)
      : false;

    if (!validUser || !validPass) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }

    const token = jwt.sign({ role: "admin" }, env.jwtSecret, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});
