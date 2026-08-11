import { useRef } from 'react'

export interface LogoItem {
  id: number
  nombre: string
  logoUrl: string | null
  sitioWeb?: string | null
}

interface LogoCarouselProps {
  logos: LogoItem[]
  /** Texto accesible del carrusel. */
  titulo?: string
}

/**
 * Barra horizontal de logos con desplazamiento por bloques.
 *
 * Las flechas avanzan y retroceden una "página" completa de logos, y al llegar
 * a un extremo continúan por el otro, de modo que el recorrido nunca se corta.
 * También se puede desplazar arrastrando o con la rueda, porque el contenedor
 * conserva su scroll nativo: las flechas son un atajo, no el único medio.
 *
 * Los logos que todavía no tienen imagen se muestran como una caja con el
 * nombre de la institución, para que la fila no quede con huecos.
 */
export function LogoCarousel({ logos, titulo = 'Instituciones del Patronato' }: LogoCarouselProps) {
  const pista = useRef<HTMLDivElement>(null)
  function desplazar(direccion: 'anterior' | 'siguiente') {
    const el = pista.current
    if (!el) return

    // La posición se lee del elemento en el momento del clic, no del estado:
    // si por cualquier motivo no llegó un evento de scroll, el estado podría
    // estar desactualizado y las flechas dejarían de responder en los extremos.
    const margen = 4
    const maximo = el.scrollWidth - el.clientWidth
    const enInicio = el.scrollLeft <= margen
    const enFinal = el.scrollLeft >= maximo - margen

    // Se avanza casi una pantalla completa, dejando un logo de solapamiento
    // para no perder el hilo de dónde se venía.
    const salto = Math.max(el.clientWidth - 120, 200)
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const comportamiento: ScrollBehavior = suave ? 'smooth' : 'auto'

    // El recorrido es circular: en un extremo se continúa por el otro.
    const destino =
      direccion === 'siguiente'
        ? enFinal
          ? 0
          : Math.min(el.scrollLeft + salto, maximo)
        : enInicio
          ? maximo
          : Math.max(el.scrollLeft - salto, 0)

    el.scrollTo({ left: destino, behavior: comportamiento })
  }

  if (logos.length === 0) return null

  return (
    <div className="logo-carrusel" role="group" aria-label={titulo}>
      <button
        type="button"
        className="logo-carrusel-flecha is-anterior"
        onClick={() => desplazar('anterior')}
        aria-label="Ver logos anteriores"
      >
        <i className="ti ti-chevron-left" />
      </button>

      <div className="logo-carrusel-pista" ref={pista}>
        {logos.map((logo) => {
          const contenido = logo.logoUrl ? (
            <img src={logo.logoUrl} alt={logo.nombre} loading="lazy" />
          ) : (
            // Sin imagen: caja con el nombre, para no dejar el hueco vacío.
            <span className="logo-carrusel-placeholder">{logo.nombre}</span>
          )

          return (
            <div className="logo-carrusel-item" key={logo.id} title={logo.nombre}>
              {logo.sitioWeb ? (
                <a href={logo.sitioWeb} target="_blank" rel="noopener">
                  {contenido}
                </a>
              ) : (
                contenido
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="logo-carrusel-flecha is-siguiente"
        onClick={() => desplazar('siguiente')}
        aria-label="Ver más logos"
      >
        <i className="ti ti-chevron-right" />
      </button>
    </div>
  )
}
