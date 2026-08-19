import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'Parque Central de Santiago'
const DEFAULT_IMAGE = '/images/galeria/vista-aerea-parque.jpg'

/**
 * Dirección definitiva del sitio, la que debe quedar en los buscadores.
 *
 * Mientras el sitio se sirve desde otra dirección (la provisional del
 * proveedor, o una copia de prueba), esa otra no debe indexarse: si Google la
 * guarda, al conectar el dominio propio quedarían dos versiones compitiendo
 * entre sí por el mismo contenido. Por eso, fuera de esta dirección se pide a
 * los buscadores que no indexen, y el día que el dominio apunte aquí la
 * indexación se activa sola, sin tocar el código.
 */
const SITIO = (import.meta.env.VITE_SITE_URL ?? 'https://parquecentralsantiago.com').replace(
  /\/$/,
  '',
)

interface PageMeta {
  title: string
  description: string
  image?: string
}

// Título y descripción propios de cada ruta, para buscadores y para la
// previsualización al compartir el enlace.
const META: Record<string, PageMeta> = {
  '/': {
    title: SITE,
    description:
      'El pulmón verde de Santiago de los Caballeros: instalaciones deportivas, actividades culturales y espacios recreativos para toda la comunidad.',
    image: DEFAULT_IMAGE,
  },
  '/sobre-el-parque': {
    title: `Historia | ${SITE}`,
    description:
      'Más de 25 años de gestión hechos realidad: cómo se fundó el Parque Central de Santiago y su relación con APEDI.',
    image: '/images/galeria/entrada-parque.jpg',
  },
  '/reglamento': {
    title: `Reglamento | ${SITE}`,
    description: 'Normas de convivencia y uso de los espacios del Parque Central de Santiago.',
    image: '/images/galeria/vista-aerea-parque.jpg',
  },
  '/instalaciones-y-servicios': {
    title: `Instalaciones y Servicios | ${SITE}`,
    description:
      'Canchas, campos de fútbol, área infantil, anfiteatro, kioscos y los servicios que ofrece el parque a la comunidad.',
    image: '/images/galeria/cancha-basketball.jpg',
  },
  '/programas-y-proyectos': {
    title: `Programas y Proyectos | ${SITE}`,
    description:
      'Cibao Fútbol Club, Escuela de Tenis, Tirolesa y Fun Stop: los programas activos del Parque Central de Santiago.',
    image: '/images/galeria/cibao-futbol-club.jpg',
  },
  '/mision-vision-valores': {
    title: `Misión, Visión y Valores | ${SITE}`,
    description:
      'La misión, la visión y los valores del Patronato para la Administración del Parque Central de Santiago.',
    image: DEFAULT_IMAGE,
  },
  '/junta-directiva': {
    title: `Junta Directiva | ${SITE}`,
    description:
      'Las instituciones que conforman el Patronato para la Administración del Parque Central de Santiago.',
    image: '/images/galeria/vista-aerea-parque.jpg',
  },
  '/personal-tecnico': {
    title: `Personal Técnico | ${SITE}`,
    description: 'El equipo administrativo y técnico del Parque Central de Santiago.',
    image: '/images/galeria/entrada-parque.jpg',
  },
  '/actividades': {
    title: `Actividades | ${SITE}`,
    description: 'La agenda de eventos y actividades del Parque Central de Santiago.',
    image: '/images/galeria/maraton-5k.jpg',
  },
  '/reserva': {
    title: `Reserva | ${SITE}`,
    description:
      'Calendario de actividades y cómo reservar un espacio en el Parque Central de Santiago.',
    image: '/images/galeria/navidad-en-el-parque.jpg',
  },
  '/galeria': {
    title: `Galería | ${SITE}`,
    description: 'Fotografías del Parque Central de Santiago y sus espacios.',
    image: '/images/galeria/parque-infantil.jpg',
  },
  '/mapa': {
    title: `Mapa del Parque | ${SITE}`,
    description: 'Ubica las principales instalaciones del Parque Central de Santiago.',
    image: '/images/galeria/vista-aerea-parque.jpg',
  },
  '/transparencia': {
    title: `Transparencia | ${SITE}`,
    description:
      'Quiénes somos, marco legal y estados financieros del Patronato para la Administración del Parque Central de Santiago.',
    image: '/images/galeria/entrada-parque.jpg',
  },
  '/blog': {
    title: `Blog | ${SITE}`,
    description: 'Artículos y noticias del Parque Central de Santiago.',
    image: '/images/galeria/dia-del-yoga.jpg',
  },
  '/apoyanos': {
    title: `Apóyanos | ${SITE}`,
    description:
      'Voluntariado y donaciones: formas de apoyar al Parque Central de Santiago.',
    image: '/images/galeria/ciclistas.jpg',
  },
  '/sugerencias': {
    title: `Sugerencias | ${SITE}`,
    description:
      'Comparte tus sugerencias, felicitaciones o quejas sobre el Parque Central de Santiago. Leemos cada mensaje.',
    image: DEFAULT_IMAGE,
  },
  '/contacto': {
    title: `Contacto | ${SITE}`,
    description:
      'Escríbenos, visítanos o contáctanos por teléfono y WhatsApp. Av. Bartolomé Colón esq. Padre Las Casas, Santiago.',
    image: '/images/galeria/gimnasio-aire-libre.jpg',
  },
}

const NOT_FOUND: PageMeta = {
  title: `Página no encontrada | ${SITE}`,
  description: 'La página que buscas no existe o fue movida.',
  image: DEFAULT_IMAGE,
}

function setTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = META[pathname] ?? NOT_FOUND
    const url = window.location.origin + pathname
    const image = window.location.origin + (meta.image ?? DEFAULT_IMAGE)

    document.title = meta.title
    setTag('name', 'description', meta.description)

    setTag('property', 'og:type', 'website')
    setTag('property', 'og:site_name', SITE)
    setTag('property', 'og:title', meta.title)
    setTag('property', 'og:description', meta.description)
    setTag('property', 'og:image', image)
    setTag('property', 'og:url', url)

    setTag('name', 'twitter:card', 'summary_large_image')
    setTag('name', 'twitter:title', meta.title)
    setTag('name', 'twitter:description', meta.description)
    setTag('name', 'twitter:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    // La canónica apunta siempre a la dirección definitiva, aunque el sitio se
    // esté viendo desde otra: es la que debe quedar en los buscadores.
    canonical.href = SITIO + pathname

    // Fuera de la dirección definitiva se pide no indexar, para no dejar una
    // copia del sitio compitiendo con la buena.
    setTag('name', 'robots', window.location.origin === SITIO ? 'index, follow' : 'noindex, nofollow')
  }, [pathname])
}
