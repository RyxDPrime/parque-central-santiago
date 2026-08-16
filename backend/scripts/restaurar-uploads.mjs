// Vuelve a subir los archivos de un respaldo y reapunta la base a los nuevos.
//
// Al mudar de servidor, el volumen donde viven las fotos y los PDF no viaja: se
// queda con el proyecto viejo. Los archivos hay que volver a subirlos, y el
// servidor les pone un nombre nuevo al guardarlos, así que las rutas que quedan
// en la base apuntarían a archivos que no existen. Este script sube cada uno y
// corrige las filas que lo referenciaban.
//
//   API_URL=https://backend-nuevo.up.railway.app/api \
//   ADMIN_USER=pcs.admin ADMIN_PASS=... \
//   node scripts/restaurar-uploads.mjs ../respaldos/2026-08-16
//
// Se puede ejecutar dos veces sin problema: lo que ya está bien no se toca.
import fs from 'node:fs/promises'
import path from 'node:path'

const carpeta = process.argv[2]
if (!carpeta) {
  console.error('Falta la carpeta del respaldo. Ej: node scripts/restaurar-uploads.mjs ../respaldos/2026-08-16')
  process.exit(1)
}

const API = (process.env.API_URL ?? '').replace(/\/$/, '')
if (!API) {
  console.error('Falta API_URL con la direccion del backend nuevo, terminada en /api')
  process.exit(1)
}

const login = await fetch(`${API}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: process.env.ADMIN_USER ?? 'pcs.admin',
    password: process.env.ADMIN_PASS,
  }),
})
if (!login.ok) {
  console.error(`No se pudo entrar al panel (${login.status}). Revisa ADMIN_USER y ADMIN_PASS.`)
  process.exit(1)
}
const { token } = await login.json()
const auth = { Authorization: `Bearer ${token}` }

/** Secciones que guardan rutas de archivos, y en qué campo. */
const SECCIONES = [
  ['junta-directiva', ['fotoUrl', 'logoUrl']],
  ['personal-tecnico', ['fotoUrl']],
  ['instalaciones', ['fotoUrl']],
  ['programas', ['fotoUrl']],
  ['actividades', ['imagenUrl']],
  ['publicaciones', ['imagenUrl']],
  ['galeria', ['url']],
  ['documentos-financieros', ['url']],
  ['puntos-mapa', ['fotoUrl']],
  ['cifras', ['imagenUrl']],
  ['aliados', ['logoUrl']],
  ['encabezados', ['imagenUrl']],
]

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf' }

// ── 1. Subir cada archivo y anotar su nombre nuevo ──
const archivos = await fs.readdir(path.join(carpeta, 'uploads'))
const equivalencias = new Map() // nombre viejo -> ruta nueva

for (const nombre of archivos) {
  const contenido = await fs.readFile(path.join(carpeta, 'uploads', nombre))
  const tipo = TIPOS[path.extname(nombre).toLowerCase()]
  if (!tipo) {
    console.log(`  se omite ${nombre}: extension no permitida`)
    continue
  }

  const forma = new FormData()
  forma.append('file', new Blob([contenido], { type: tipo }), nombre)

  const r = await fetch(`${API}/uploads`, { method: 'POST', headers: auth, body: forma })
  if (!r.ok) {
    console.error(`  fallo al subir ${nombre}: ${r.status} ${await r.text()}`)
    continue
  }
  const { url } = await r.json()
  equivalencias.set(nombre, url)
  console.log(`  subido ${nombre} -> ${url}`)
}

console.log(`\nArchivos subidos: ${equivalencias.size} de ${archivos.length}.\n`)

// ── 2. Reapuntar las filas de la base ──
/** Del valor guardado se toma el nombre del archivo, sin ruta ni dominio. */
function nombreDe(valor) {
  return valor.split('/').pop()
}

let corregidas = 0
let sinArchivo = []

for (const [ruta, columnas] of SECCIONES) {
  const filas = await (await fetch(`${API}/${ruta}`)).json()

  for (const fila of filas) {
    const cambios = {}

    for (const columna of columnas) {
      const valor = fila[columna]
      if (typeof valor !== 'string' || !valor.includes('/uploads/')) continue

      const nueva = equivalencias.get(nombreDe(valor))
      if (!nueva) {
        sinArchivo.push(`${ruta} #${fila.id} ${columna}: ${nombreDe(valor)}`)
        continue
      }
      // Ya apunta al archivo correcto: no hace falta escribir.
      if (valor === nueva) continue
      cambios[columna] = nueva
    }

    if (Object.keys(cambios).length === 0) continue

    const r = await fetch(`${API}/${ruta}/${fila.id}`, {
      method: 'PUT',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    })
    if (!r.ok) {
      console.error(`  fallo al corregir ${ruta} #${fila.id}: ${r.status}`)
      continue
    }
    for (const [columna, nueva] of Object.entries(cambios)) {
      console.log(`  ${ruta} #${fila.id} ${columna} -> ${nueva}`)
    }
    corregidas++
  }
}

console.log(`\nFilas corregidas: ${corregidas}.`)
if (sinArchivo.length) {
  console.log('\nEstas filas apuntan a un archivo que no estaba en el respaldo:')
  for (const s of sinArchivo) console.log('  ' + s)
}
