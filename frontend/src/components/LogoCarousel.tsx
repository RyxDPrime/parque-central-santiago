import { useEffect, useRef } from 'react'

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

/** Aceleración y frenado suaves (easeInOut). Entra en 0 y sale en 1. */
function suavizar(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

/** Píxeles por segundo del avance continuo. */
const VELOCIDAD = 40
/** Segundos que tarda en alcanzar o soltar esa velocidad. */
const RAMPA = 0.5
/** Segundos que dura el salto de una flecha. */
const SALTO = 0.55

/**
 * Barra horizontal de logos que avanza sola, con flechas para adelantar.
 *
 * La fila de logos se pinta dos veces: la segunda copia es la que permite que
 * el recorrido vuelva a empezar sin que se vea el corte. Al llegar al final de
 * la primera vuelta la posición retrocede exactamente un ciclo, y como en ese
 * punto la pantalla muestra la copia, el salto es invisible.
 *
 * El desplazamiento se lleva en una variable propia y no leyendo `scrollLeft`:
 * el navegador redondea esa propiedad a píxeles enteros, así que a esta
 * velocidad el avance de cada cuadro (menos de un píxel) se perdía al leerlo de
 * vuelta y la fila se quedaba quieta.
 *
 * Los logos que todavía no tienen imagen se muestran como una caja con el
 * nombre de la institución, para que la fila no quede con huecos.
 */
export function LogoCarousel({ logos, titulo = 'Instituciones del Patronato' }: LogoCarouselProps) {
  const pista = useRef<HTMLDivElement>(null)
  // Se pausa mientras el mouse está encima o el visitante arrastra la fila,
  // para que no se le mueva debajo del cursor lo que está mirando.
  const pausado = useRef(false)
  // Lo expone el bucle de animación para que las flechas puedan pedirle un
  // salto en vez de mover el scroll por su cuenta y pelearse con él.
  const saltar = useRef<((pixeles: number) => void) | null>(null)

  useEffect(() => {
    const el = pista.current
    if (!el) return

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)')

    let posicion = 0
    // Avance actual como fracción de la velocidad máxima: sube al arrancar y
    // baja al pausar, de ahí que no empiece ni se detenga de golpe.
    let marcha = 0
    let salto: { desde: number; hasta: number; inicio: number } | null = null
    let ultimo = 0
    let cuadro = 0

    /** Largo de una vuelta: la distancia entre un logo y su copia. */
    function ciclo(): number {
      const hijos = el!.children
      const copia = hijos[logos.length] as HTMLElement | undefined
      if (!copia) return el!.scrollWidth / 2
      return copia.offsetLeft - (hijos[0] as HTMLElement).offsetLeft
    }

    saltar.current = (pixeles: number) => {
      const desde = salto ? salto.hasta : posicion
      salto = { desde, hasta: desde + pixeles, inicio: performance.now() }
    }

    function paso(ahora: number) {
      cuadro = requestAnimationFrame(paso)
      if (!ultimo) ultimo = ahora
      const delta = Math.min((ahora - ultimo) / 1000, 0.1)
      ultimo = ahora

      const vuelta = ciclo()
      if (vuelta <= 0) return

      if (salto) {
        const t = Math.min((ahora - salto.inicio) / (SALTO * 1000), 1)
        posicion = salto.desde + (salto.hasta - salto.desde) * suavizar(t)
        if (t >= 1) salto = null
      } else {
        // Con "reducir movimiento" no hay avance automático, pero las flechas
        // siguen funcionando: el carrusel se mueve solo si se lo pide.
        const objetivo = pausado.current || quieto.matches ? 0 : 1
        const avance = delta / RAMPA
        marcha = objetivo > marcha ? Math.min(marcha + avance, 1) : Math.max(marcha - avance, 0)

        if (marcha === 0) {
          // Ya frenó del todo: manda el visitante. Se adopta la posición a la
          // que haya arrastrado la fila y no se escribe nada, porque hacerlo
          // le devolvería el scroll debajo del dedo.
          posicion = el!.scrollLeft
          return
        }

        posicion += VELOCIDAD * suavizar(marcha) * delta
      }

      // La posición se mantiene dentro de una vuelta; la copia cubre el corte.
      posicion = ((posicion % vuelta) + vuelta) % vuelta
      el!.scrollLeft = posicion
    }

    cuadro = requestAnimationFrame(paso)
    return () => {
      cancelAnimationFrame(cuadro)
      saltar.current = null
    }
  }, [logos.length])

  function desplazar(direccion: 'anterior' | 'siguiente') {
    const el = pista.current
    if (!el || !saltar.current) return
    // Casi una pantalla completa, dejando un logo de solapamiento para no
    // perder el hilo de dónde se venía.
    const distancia = Math.max(el.clientWidth - 120, 200)
    saltar.current(direccion === 'siguiente' ? distancia : -distancia)
  }

  if (logos.length === 0) return null

  function tarjeta(logo: LogoItem, copia: boolean) {
    const contenido = logo.logoUrl ? (
      <img src={logo.logoUrl} alt={copia ? '' : logo.nombre} />
    ) : (
      // Sin imagen: caja con el nombre, para no dejar el hueco vacío.
      <span className="logo-carrusel-placeholder">{logo.nombre}</span>
    )

    return (
      <div
        className="logo-carrusel-item"
        key={copia ? `${logo.id}-copia` : logo.id}
        title={logo.nombre}
        // La segunda vuelta es decorativa: existe para que el bucle no se
        // note, y repetirla en voz alta o al tabular sería ruido.
        aria-hidden={copia || undefined}
      >
        {logo.sitioWeb ? (
          <a href={logo.sitioWeb} target="_blank" rel="noopener" tabIndex={copia ? -1 : undefined}>
            {contenido}
          </a>
        ) : (
          contenido
        )}
      </div>
    )
  }

  return (
    <div
      className="logo-carrusel"
      role="group"
      aria-label={titulo}
      onMouseEnter={() => (pausado.current = true)}
      onMouseLeave={() => (pausado.current = false)}
      onFocusCapture={() => (pausado.current = true)}
      onBlurCapture={() => (pausado.current = false)}
      onPointerDown={() => (pausado.current = true)}
      onPointerUp={() => (pausado.current = false)}
    >
      <button
        type="button"
        className="logo-carrusel-flecha is-anterior"
        onClick={() => desplazar('anterior')}
        aria-label="Ver logos anteriores"
      >
        <i className="ti ti-chevron-left" />
      </button>

      <div className="logo-carrusel-pista" ref={pista}>
        {logos.map((logo) => tarjeta(logo, false))}
        {logos.map((logo) => tarjeta(logo, true))}
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
