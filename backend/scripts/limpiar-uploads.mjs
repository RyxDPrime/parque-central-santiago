// Los archivos del volumen que ya no referencia nadie.
//
// Al borrar una instalación, un aliado o un documento desde el panel, su foto
// o su PDF se quedan en el volumen: nada los borra. No rompe nada, pero el
// espacio solo crece, y el volumen tiene un tope.
//
// Por omisión solo informa. Para borrar de verdad hay que pedirlo:
//
//   node scripts/limpiar-uploads.mjs            # lista lo que sobra
//   node scripts/limpiar-uploads.mjs --borrar   # lo borra
//
// Necesita DATABASE_URL, y que UPLOADS_DIR apunte a la misma carpeta que usa
// el servidor. En Railway se ejecuta con `railway run`, para que el volumen y
// la base sean los de verdad y no los de la máquina de quien lo lanza.
//
// Qué se considera "referenciado": cualquier columna de texto de cualquier
// tabla cuyo valor mencione /uploads/. Se busca así, y no por una lista de
// columnas escrita aquí, porque esa lista se quedaría vieja en cuanto alguien
// añada un modelo con foto — y quedarse vieja, en un script que borra, es
// borrar archivos que sí se usaban.
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'

const prisma = new PrismaClient()
const borrar = process.argv.includes('--borrar')
const carpeta = path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads')

/** Los nombres de archivo que alguna fila menciona hoy. */
async function referenciados() {
  const columnas = await prisma.$queryRaw`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying')
  `

  const nombres = new Set()
  for (const { table_name: tabla, column_name: columna } of columnas) {
    const filas = await prisma.$queryRawUnsafe(
      `SELECT DISTINCT "${columna}" AS valor FROM "${tabla}" WHERE "${columna}" LIKE '%/uploads/%'`,
    )
    for (const { valor } of filas) {
      // Una misma columna puede traer varias rutas si el texto las lleva
      // dentro (por ejemplo el cuerpo de una publicación del blog).
      for (const ruta of valor.match(/\/uploads\/[^\s"'<>)]+/g) ?? []) {
        nombres.add(path.basename(ruta))
      }
    }
  }
  return nombres
}

const enUso = await referenciados()

let archivos
try {
  archivos = await fs.readdir(carpeta)
} catch {
  console.error(`No existe la carpeta ${carpeta}. Revisa UPLOADS_DIR.`)
  process.exit(1)
}

const sobran = archivos.filter((nombre) => !enUso.has(nombre))

if (sobran.length === 0) {
  console.log(`${archivos.length} archivos en ${carpeta}, todos en uso. No hay nada que limpiar.`)
  await prisma.$disconnect()
  process.exit(0)
}

let bytes = 0
for (const nombre of sobran) {
  const { size } = await fs.stat(path.join(carpeta, nombre))
  bytes += size
  console.log(`  ${borrar ? 'borrado' : 'sobra'}: ${nombre} (${(size / 1024).toFixed(0)} KB)`)
  if (borrar) await fs.rm(path.join(carpeta, nombre))
}

const mb = (bytes / 1024 / 1024).toFixed(1)
console.log(
  borrar
    ? `\nBorrados ${sobran.length} de ${archivos.length} archivos. Liberados ${mb} MB.`
    : `\nSobran ${sobran.length} de ${archivos.length} archivos, ${mb} MB. Vuelve a ejecutarlo con --borrar para eliminarlos.`,
)

await prisma.$disconnect()
