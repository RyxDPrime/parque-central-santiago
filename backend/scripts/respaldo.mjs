// Respaldo completo del contenido del sitio.
//
// Vuelca cada tabla a JSON y descarga los archivos que se subieron desde el
// panel. La estructura de la base no se respalda aquí porque ya vive en
// prisma/migrations: con esas migraciones y este archivo se reconstruye todo
// en cualquier PostgreSQL.
//
//   node scripts/respaldo.mjs [carpeta]
//
// Necesita DATABASE_URL apuntando a la base que se quiere respaldar.
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'

const prisma = new PrismaClient()

// Todos los modelos con contenido. El orden importa al restaurar solo si
// hubiera relaciones entre tablas; hoy no las hay, cada una es independiente.
const MODELOS = [
  'juntaDirectivo',
  'personalTecnico',
  'instalacion',
  'programa',
  'actividad',
  'publicacion',
  'galeriaItem',
  'documentoFinanciero',
  'puntoMapa',
  'hito',
  'norma',
  'pasoReserva',
  'formaApoyo',
  'cifra',
  'aliado',
  'texto',
  'encabezadoPagina',
  'contactMessage',
]

/** Campos que pueden contener la ruta de un archivo subido. */
const CAMPOS_ARCHIVO = ['fotoUrl', 'logoUrl', 'imagenUrl', 'url']

const destino = process.argv[2] ?? path.join('respaldos', new Date().toISOString().slice(0, 10))
await fs.mkdir(path.join(destino, 'uploads'), { recursive: true })

// ── 1. Contenido de las tablas ──
const datos = {}
let totalFilas = 0
for (const modelo of MODELOS) {
  const filas = await prisma[modelo].findMany()
  datos[modelo] = filas
  totalFilas += filas.length
  console.log(`  ${modelo.padEnd(20)} ${String(filas.length).padStart(4)} filas`)
}

await fs.writeFile(
  path.join(destino, 'contenido.json'),
  JSON.stringify({ generado: new Date().toISOString(), datos }, null, 2),
  'utf8',
)
console.log(`\nContenido guardado: ${totalFilas} filas en total.`)

// ── 2. Archivos subidos desde el panel ──
// Se reconocen porque su ruta apunta a /uploads/, ya sea absoluta (como se
// guardaba antes) o relativa. Lo que empieza por /images/ vive en el
// repositorio del frontend y no hace falta respaldarlo aquí.
const rutas = new Set()
for (const filas of Object.values(datos)) {
  for (const fila of filas) {
    for (const campo of CAMPOS_ARCHIVO) {
      const valor = fila[campo]
      if (typeof valor === 'string' && valor.includes('/uploads/')) rutas.add(valor)
    }
  }
}

const BASE = process.env.BACKEND_URL ?? 'https://backend-production-b261.up.railway.app'
let bajados = 0
const fallos = []

for (const ruta of rutas) {
  const url = ruta.startsWith('http') ? ruta : `${BASE}${ruta}`
  const nombre = url.split('/').pop()
  try {
    const respuesta = await fetch(url)
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
    const contenido = Buffer.from(await respuesta.arrayBuffer())
    await fs.writeFile(path.join(destino, 'uploads', nombre), contenido)
    console.log(`  bajado  ${nombre} (${(contenido.length / 1024).toFixed(0)} kB)`)
    bajados++
  } catch (error) {
    fallos.push(`${nombre}: ${error.message}`)
  }
}

console.log(`\nArchivos subidos: ${bajados} de ${rutas.size}.`)
if (fallos.length) {
  console.log('No se pudieron bajar:')
  for (const f of fallos) console.log('  ' + f)
}

console.log(`\nRespaldo completo en: ${destino}`)
await prisma.$disconnect()
