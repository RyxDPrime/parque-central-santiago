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
// el servidor. En Railway se ejecuta con `railway ssh --service backend`, para
// que el volumen y la base sean los de verdad y no los de la máquina de quien
// lo lanza; con `railway run` leería una carpeta local que no es el volumen.
//
// Qué se considera "referenciado": cualquier columna de texto de cualquier
// tabla cuyo valor mencione /uploads/. Se busca así, y no por una lista de
// columnas escrita aquí, porque esa lista se quedaría vieja en cuanto alguien
// añada un modelo con foto — y quedarse vieja, en un script que borra, es
// borrar archivos que sí se usaban.
//
// Las cuentas viven en scripts/lib/uploads.mjs, que es lo que cubren los tests.
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import { nombresReferenciados, soloArchivos, sobrantes } from './lib/uploads.mjs'

const prisma = new PrismaClient()
const borrar = process.argv.includes('--borrar')
const carpeta = path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads')

/** Todos los valores de texto de la base que mencionan una ruta de /uploads/. */
async function valoresConRutas() {
  const columnas = await prisma.$queryRaw`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND data_type IN ('text', 'character varying')
  `

  const valores = []
  for (const { table_name: tabla, column_name: columna } of columnas) {
    const filas = await prisma.$queryRawUnsafe(
      `SELECT DISTINCT "${columna}" AS valor FROM "${tabla}" WHERE "${columna}" LIKE '%/uploads/%'`,
    )
    for (const { valor } of filas) valores.push(valor)
  }
  return valores
}

const enUso = nombresReferenciados(await valoresConRutas())

let entradas
try {
  entradas = await fs.readdir(carpeta, { withFileTypes: true })
} catch {
  console.error(`No existe la carpeta ${carpeta}. Revisa UPLOADS_DIR.`)
  process.exit(1)
}

const archivos = soloArchivos(entradas)
const sobra = sobrantes(archivos, enUso)

if (sobra.length === 0) {
  console.log(`${archivos.length} archivos en ${carpeta}, todos en uso. No hay nada que limpiar.`)
  await prisma.$disconnect()
  process.exit(0)
}

let bytes = 0
for (const nombre of sobra) {
  const { size } = await fs.stat(path.join(carpeta, nombre))
  bytes += size
  console.log(`  ${borrar ? 'borrado' : 'sobra'}: ${nombre} (${(size / 1024).toFixed(0)} KB)`)
  if (borrar) await fs.rm(path.join(carpeta, nombre))
}

const mb = (bytes / 1024 / 1024).toFixed(1)
console.log(
  borrar
    ? `\nBorrados ${sobra.length} de ${archivos.length} archivos. Liberados ${mb} MB.`
    : `\nSobran ${sobra.length} de ${archivos.length} archivos, ${mb} MB. Vuelve a ejecutarlo con --borrar para eliminarlos.`,
)

await prisma.$disconnect()
