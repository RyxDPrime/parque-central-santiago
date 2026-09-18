// El cliente de base de datos para los scripts de operacion y las semillas.
//
// Desde Prisma 7 el cliente no trae motor propio: se conecta a traves de un
// adaptador del driver de Postgres, y hay que pasarle la URL al crearlo. Antes
// cada script hacia `new PrismaClient()` y Prisma leia DATABASE_URL solo; ahora
// todos pasan por aqui para no repetir la conexion en diez sitios.
//
// El servidor hace lo mismo en src/config/db.ts. Son dos copias porque aquello
// se compila a CommonJS y esto es un modulo ES suelto, y no se importan entre
// si sin complicar la compilacion.
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

export function conectar() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Falta DATABASE_URL: este script necesita saber a que base conectarse.')
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
}
