import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

/**
 * El cliente de base de datos del servidor.
 *
 * Desde Prisma 7 el cliente no trae motor propio: se conecta a traves de un
 * adaptador del driver de Postgres, y la URL se le pasa aqui en vez de leerla
 * del esquema. Los scripts de operacion y las semillas hacen lo mismo en
 * scripts/lib/prisma.mjs; son dos copias de tres lineas porque aquellos son
 * modulos ES sueltos y esto se compila a CommonJS, y no se importan entre si.
 */
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = new PrismaClient({ adapter });
