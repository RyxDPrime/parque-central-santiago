// Quita el dominio del backend de las rutas de archivos ya guardadas.
//
// Durante un tiempo el panel guardaba la URL completa
// (https://backend-….up.railway.app/uploads/foto.jpg). Eso ata el contenido al
// servidor donde estaba alojado: al cambiar de proveedor o poner el dominio
// propio del parque, todas esas fotos apuntarían a un servidor que ya no
// responde. Se dejan relativas (/uploads/foto.jpg) y el dominio se le pone al
// mostrarlas.
//
//   node scripts/rutas-relativas.mjs           (muestra qué cambiaría)
//   node scripts/rutas-relativas.mjs --aplicar (lo hace)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const aplicar = process.argv.includes('--aplicar')

const CAMPOS = [
  ['juntaDirectivo', ['fotoUrl', 'logoUrl']],
  ['personalTecnico', ['fotoUrl']],
  ['instalacion', ['fotoUrl']],
  ['programa', ['fotoUrl']],
  ['actividad', ['imagenUrl']],
  ['publicacion', ['imagenUrl']],
  ['galeriaItem', ['url']],
  ['documentoFinanciero', ['url']],
  ['puntoMapa', ['fotoUrl']],
  ['cifra', ['imagenUrl']],
  ['aliado', ['logoUrl']],
  ['encabezadoPagina', ['imagenUrl']],
]

/** Recorta cualquier dominio, quedándose desde /uploads/ en adelante. */
function relativa(valor) {
  const corte = valor.indexOf('/uploads/')
  return corte > 0 ? valor.slice(corte) : valor
}

let cambios = 0

for (const [modelo, columnas] of CAMPOS) {
  for (const fila of await prisma[modelo].findMany()) {
    const datos = {}
    for (const columna of columnas) {
      const valor = fila[columna]
      // Solo las absolutas que apuntan a un archivo subido. Lo que empieza por
      // /images/ vive en el repositorio del frontend y ya es relativo.
      if (typeof valor === 'string' && valor.startsWith('http') && valor.includes('/uploads/')) {
        datos[columna] = relativa(valor)
      }
    }
    if (Object.keys(datos).length === 0) continue

    cambios++
    for (const [columna, nuevo] of Object.entries(datos)) {
      console.log(`  ${modelo} #${fila.id} ${columna}`)
      console.log(`     antes: ${fila[columna]}`)
      console.log(`     ahora: ${nuevo}`)
    }
    if (aplicar) await prisma[modelo].update({ where: { id: fila.id }, data: datos })
  }
}

console.log(
  cambios === 0
    ? '\nNo hay rutas absolutas: todo está ya relativo.'
    : aplicar
      ? `\nActualizadas ${cambios} filas.`
      : `\n${cambios} filas por actualizar. Vuelve a ejecutarlo con --aplicar.`,
)

await prisma.$disconnect()
