// Configuracion de Prisma (obligatoria desde la version 7).
//
// Aqui vive lo que antes estaba repartido: la conexion a la base salia del
// esquema, y la semilla de package.json. Prisma ya no lee ninguno de los dos.
//
// dotenv se carga a mano porque Prisma 7 no lee .env por su cuenta. En
// Railway no hace falta —las variables ya estan en el entorno— pero no
// estorba, y en local es lo que hace que `prisma migrate dev` encuentre la
// base.
import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` tambien lee este archivo, y corre en sitios sin base: la
// integracion continua y el `postinstall` de cualquier `npm install`. Si la
// URL faltara ahi, generar el cliente fallaria por una variable que ese paso
// ni siquiera usa. Se pone un valor de relleno que se delata solo: cualquier
// comando que si necesite la base fallara diciendo "falta-database-url" como
// servidor, en vez de un error de conexion sin pista.
const url = process.env.DATABASE_URL ?? "postgresql://falta@falta-database-url:5432/falta";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: { url },
});
