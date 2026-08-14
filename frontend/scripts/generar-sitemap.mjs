// Genera dist/sitemap.xml al terminar la compilación.
//
// Las rutas se leen de App.tsx en vez de escribirlas aquí: es la única lista
// que existe de verdad, y así una página nueva entra sola en el mapa del sitio
// sin que nadie tenga que acordarse de venir a agregarla.
import fs from 'node:fs/promises'
import path from 'node:path'

const RAIZ = path.resolve(import.meta.dirname, '..')

// Dónde vivirá el sitio de cara al público. Se puede cambiar sin tocar el
// código, con la variable SITE_URL.
const SITIO = (process.env.SITE_URL ?? 'https://parquecentralsantiago.com').replace(/\/$/, '')

/** Cuánto pesa cada página dentro del sitio, para los buscadores. */
function prioridad(ruta) {
  if (ruta === '/') return '1.0'
  return ['/instalaciones-y-servicios', '/actividades', '/contacto', '/sobre-el-parque'].includes(ruta)
    ? '0.8'
    : '0.6'
}

/** Cada cuánto cambia. Lo que se administra a diario se revisa más seguido. */
function frecuencia(ruta) {
  if (['/actividades', '/blog', '/galeria'].includes(ruta)) return 'weekly'
  if (ruta === '/') return 'weekly'
  return 'monthly'
}

const app = await fs.readFile(path.join(RAIZ, 'src/App.tsx'), 'utf8')

const rutas = [...app.matchAll(/<Route\s+path="(\/[^"]*)"/g)]
  .map((m) => m[1])
  // Fuera el panel y el comodín de página no encontrada: uno es privado y el
  // otro no es una página real.
  .filter((ruta) => ruta !== '/*' && !ruta.startsWith('/admin'))

if (rutas.length === 0) {
  console.error('No se encontró ninguna ruta en App.tsx. ¿Cambió la forma de declararlas?')
  process.exit(1)
}

const fecha = new Date().toISOString().slice(0, 10)

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...rutas.map((ruta) =>
    [
      '  <url>',
      `    <loc>${SITIO}${ruta === '/' ? '/' : ruta}</loc>`,
      `    <lastmod>${fecha}</lastmod>`,
      `    <changefreq>${frecuencia(ruta)}</changefreq>`,
      `    <priority>${prioridad(ruta)}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n')

await fs.writeFile(path.join(RAIZ, 'dist/sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml: ${rutas.length} páginas sobre ${SITIO}`)
