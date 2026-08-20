// Crea el primer administrador del panel.
//
// Hasta ahora el acceso era una credencial unica en las variables de entorno,
// compartida por todo el equipo. Al pasar a usuarios con nombre propio hay que
// sembrar al menos uno, o nadie podria entrar a crear los demas.
//
// Toma ADMIN_USERNAME y ADMIN_PASSWORD_HASH tal como estaban, asi que quien ya
// usaba el panel entra igual que siempre. Si el usuario ya existe, no lo toca.
//
//   node scripts/crear-admin.mjs
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const usuario = (process.env.ADMIN_USERNAME ?? '').trim().toLowerCase()
const hash = process.env.ADMIN_PASSWORD_HASH ?? ''
// Solo si no hay hash: permite sembrar con una clave en claro de una vez.
const claveEnClaro = process.env.ADMIN_PASSWORD ?? ''

if (!usuario) {
  console.error('Falta ADMIN_USERNAME')
  process.exit(1)
}
if (!hash && !claveEnClaro) {
  console.error('Falta ADMIN_PASSWORD_HASH (o ADMIN_PASSWORD)')
  process.exit(1)
}

const existente = await prisma.usuario.findUnique({ where: { usuario } })
if (existente) {
  console.log(`"${usuario}" ya existe (rol: ${existente.rol}). No se toca.`)
} else {
  const creado = await prisma.usuario.create({
    data: {
      nombre: 'Administrador del Parque',
      usuario,
      rol: 'admin',
      passwordHash: hash || (await bcrypt.hash(claveEnClaro, 10)),
    },
  })
  console.log(`Creado "${creado.usuario}" con rol ${creado.rol}.`)
}

const admins = await prisma.usuario.count({ where: { rol: 'admin', activo: true } })
console.log(`Administradores activos: ${admins}`)

await prisma.$disconnect()
