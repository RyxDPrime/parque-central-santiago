// Restaura un respaldo hecho con scripts/respaldo.mjs en una base vacía.
//
//   1. Crear la base nueva y apuntar DATABASE_URL a ella
//   2. npx prisma migrate deploy        (levanta la estructura)
//   3. node scripts/restaurar.mjs respaldos/2026-08-14
//   4. Copiar la carpeta uploads/ del respaldo al volumen del servidor nuevo
//
// Se niega a escribir sobre tablas que ya tienen datos, para que no se pueda
// duplicar el contenido de una base en uso por error.
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'

const prisma = new PrismaClient()

const carpeta = process.argv[2]
if (!carpeta) {
  console.error('Falta la carpeta del respaldo. Ej: node scripts/restaurar.mjs respaldos/2026-08-14')
  process.exit(1)
}

const forzar = process.argv.includes('--forzar')

const { generado, datos } = JSON.parse(
  await fs.readFile(path.join(carpeta, 'contenido.json'), 'utf8'),
)
console.log(`Respaldo del ${generado}\n`)

// Primero se comprueba todo y después se escribe: si una tabla no está vacía,
// mejor detenerse antes de haber insertado nada en las demás.
const ocupadas = []
for (const modelo of Object.keys(datos)) {
  if ((await prisma[modelo].count()) > 0) ocupadas.push(modelo)
}

if (ocupadas.length && !forzar) {
  console.error('Estas tablas ya tienen datos:', ocupadas.join(', '))
  console.error('Restaurar encima duplicaría el contenido. Vacíalas primero, o usa --forzar')
  process.exit(1)
}

let total = 0
for (const [modelo, filas] of Object.entries(datos)) {
  if (filas.length === 0) continue
  // Se conservan los id originales: las rutas de las fotos y las claves de
  // los textos no dependen de ellos, pero mantenerlos hace que el respaldo y
  // la base restaurada sean comparables fila por fila.
  await prisma[modelo].createMany({ data: filas, skipDuplicates: true })

  // createMany no adelanta la secuencia de los id, así que el siguiente
  // registro que se cree chocaría con uno existente.
  const tabla = modelo.charAt(0).toUpperCase() + modelo.slice(1)
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${tabla}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tabla}"), 1))`,
  )

  console.log(`  ${modelo.padEnd(20)} ${String(filas.length).padStart(4)} filas`)
  total += filas.length
}

console.log(`\nRestauradas ${total} filas.`)
console.log('Falta copiar la carpeta uploads/ del respaldo al volumen del servidor.')
await prisma.$disconnect()
