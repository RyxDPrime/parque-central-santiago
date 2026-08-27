import { useLayoutEffect } from 'react'

/**
 * Las piezas del sitio aparecen cuando entran en pantalla, en vez de estar ahí
 * de golpe. Se usa una sola vez, en el Layout.
 *
 * Tres decisiones que conviene conocer antes de tocar esto:
 *
 * 1. **Si el JavaScript no corre, no se esconde nada.** El estado inicial
 *    —invisible y desplazado— lo inyecta este mismo archivo al arrancar. Si
 *    algo fallara, la página se ve completa en vez de quedarse en blanco, que
 *    es como fallan las animaciones de aparición mal hechas.
 *
 * 2. **Quien pide menos movimiento recibe solo el fundido.** El sistema
 *    operativo permite pedir que se reduzcan las animaciones —Windows lo hace
 *    solo al desactivar los efectos visuales—, y hay personas a las que el
 *    desplazamiento les produce mareo. Lo que marea es el deslizamiento, no
 *    que algo aparezca, así que en ese caso se quita el movimiento y se deja
 *    el fundido. Vive en el CSS y no aquí, para que cambiar el ajuste del
 *    sistema surta efecto sin recargar.
 *
 * 3. **La dirección no se escribe aquí.** Cada pieza dice de dónde entra desde
 *    el CSS, con dos variables. Así los bloques de la portada, que alternan la
 *    foto a izquierda y derecha, entran cada uno desde su lado sin que nadie
 *    tenga que numerarlos a mano.
 */

/**
 * Las piezas concretas: tarjetas, encabezados, las dos mitades de un bloque con
 * foto. Son las que tienen dirección propia y entran en cascada.
 */
const PIEZAS = [
  // Encabezados de sección
  '.sec-label',
  '.sec-title',
  '.sec-sub',
  // Bloques con foto de la portada: entran desde el lado donde está la foto
  '.stat-row .stat-img',
  '.stat-row .stat-texto',
  // Tarjetas que se repiten en rejilla
  '.quick-card',
  '.leadership-card',
  '.facility-icon-card',
  '.facility-photo-card',
  '.program-card',
  '.staff-card',
  '.support-card',
  '.proposito-card',
  '.document-card',
  '.gallery-tile',
  '.post-item',
  '.agenda-item',
  '.story-hito',
  '.step-card',
  '.map-grid > *',
].join(',')

/**
 * Y todo lo demás: cada bloque suelto de una sección, sin tener que
 * enumerarlos. Sin esto habría que ir listando el nombre de cada pieza de cada
 * página, y bastaría una página nueva —o un bloque que solo aparece en cierto
 * modo, como la historia en párrafo— para que se quedara quieta sin que nadie
 * se diera cuenta.
 */
const BLOQUES = ['.page-hero-inner', '.section-inner > *'].join(',')

const ANIMABLES = `${PIEZAS},${BLOQUES}`

/**
 * El estado inicial y la transición, inyectados desde aquí.
 *
 * `:where()` deja la regla sin peso, para que cualquier ajuste escrito en la
 * hoja de estilos gane sin pelear. El desplazamiento sale de dos variables con
 * valor por defecto —hacia arriba, que es el movimiento general— y cada pieza
 * lo cambia si entra de lado.
 */
const ESTILO = `
:where(.js-anima) :is(${ANIMABLES}) {
  opacity: 0;
  transform: translate3d(var(--anima-x, 0), var(--anima-y, 26px), 0);
  transition:
    opacity .65s cubic-bezier(.22, .61, .36, 1),
    transform .65s cubic-bezier(.22, .61, .36, 1);
  transition-delay: var(--anima-espera, 0s);
}
:where(.js-anima) :is(${ANIMABLES}).es-visible {
  opacity: 1;
  transform: none;
}

/* Quien pidió menos movimiento ve aparecer las secciones, pero sin que se
   desplacen ni se escalonen: lo que produce mareo es el recorrido, no que algo
   surja. Va en una consulta de medios y no en un corte del JavaScript para que
   cambiar el ajuste del sistema se note sin recargar la página. */
@media (prefers-reduced-motion: reduce) {
  :where(.js-anima) :is(${ANIMABLES}) {
    transform: none;
    transition-duration: .35s;
    transition-delay: 0s;
  }
}
`

export function useAnimarAlEntrar(): void {
  useLayoutEffect(() => {
    // Sin soporte del navegador, todo se queda visible y no pasa nada.
    if (typeof IntersectionObserver === 'undefined') return

    const estilo = document.createElement('style')
    estilo.dataset.anima = ''
    estilo.textContent = ESTILO
    document.head.appendChild(estilo)

    const raiz = document.documentElement
    raiz.classList.add('js-anima')

    // Si el navegador nunca contesta, hay que deshacerlo todo: ver mas abajo.
    let contesto = false

    const observador = new IntersectionObserver(
      (entradas) => {
        contesto = true
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue
          entrada.target.classList.add('es-visible')
          // Una vez visible se deja de vigilar: la pieza no vuelve a esconderse
          // al subir, que marea y hace la página imprevisible.
          observador.unobserve(entrada.target)
        }
      },
      // El margen negativo abajo hace que la pieza entre cuando ya se ve de
      // verdad, y no en el instante en que asoma un píxel por el borde.
      //
      // El umbral es cero a propósito: pedir un porcentaje del elemento parece
      // más fino, pero un bloque más alto que la pantalla nunca llega a
      // enseñar esa fracción de sí mismo, y se quedaría invisible para
      // siempre. El margen ya cumple ese papel sin ese riesgo.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    function registrar() {
      for (const el of document.querySelectorAll(ANIMABLES)) {
        if (el.hasAttribute('data-anima')) continue
        // Se anima la pieza más pequeña que aplique: si este elemento lleva
        // dentro otras que se animan solas, se queda quieto. De lo contrario la
        // rejilla entera se desplazaría y sus tarjetas otra vez encima, y el
        // movimiento se vería doble.
        if (el.querySelector(ANIMABLES)) continue
        el.setAttribute('data-anima', '')
        observador.observe(el)
      }
    }
    registrar()

    /**
     * Red de seguridad.
     *
     * Todo esto se apoya en que el navegador avise cuando una pieza entra en
     * pantalla. Si no avisa —pasa en vistas que no se dibujan, y bastaria un
     * navegador raro o una pestana en segundo plano al cargar— las piezas se
     * quedarian escondidas para siempre y el sitio se veria vacio.
     *
     * Asi que se le da un margen para contestar, y si no lo hace se retira el
     * efecto entero y la pagina aparece completa. Perder la animacion es un
     * detalle; perder el contenido, no.
     */
    const vigilante = window.setTimeout(() => {
      if (!contesto) raiz.classList.remove('js-anima')
    }, 1200)

    // Casi todo el contenido llega de la API después de dibujar la página, así
    // que hay que volver a mirar cuando aparecen elementos nuevos. Se agrupa en
    // un temporizador corto para no recorrer el documento en cada cambio.
    let pendiente: number | undefined
    const cambios = new MutationObserver(() => {
      window.clearTimeout(pendiente)
      pendiente = window.setTimeout(registrar, 60)
    })
    cambios.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.clearTimeout(vigilante)
      window.clearTimeout(pendiente)
      cambios.disconnect()
      observador.disconnect()
      raiz.classList.remove('js-anima')
      estilo.remove()
    }
  }, [])
}
