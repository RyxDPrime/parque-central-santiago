import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { PuntoMapa } from '../api/client'

// Centro del parque, usado cuando todavía no hay puntos cargados.
export const CENTRO_PARQUE: [number, number] = [19.4667, -70.6953]

interface ParkMapProps {
  puntos: PuntoMapa[]
  /** Alto del mapa en píxeles. */
  alto?: number
  /** Punto resaltado desde fuera (por ejemplo al pasar por su ficha). */
  activo?: number | null
  onSeleccionar?: (id: number) => void
  /** Sin controles ni arrastre: para la vista reducida del inicio. */
  estatico?: boolean
}

/**
 * Mapa interactivo con los puntos del parque, sobre OpenStreetMap.
 *
 * Se usa Leaflet directamente en vez de un envoltorio de React para no
 * depender de que este soporte la versión de React del proyecto. Los
 * marcadores quedan anclados a sus coordenadas, así que acompañan al mapa al
 * desplazarlo y acercarlo.
 */
export function ParkMap({
  puntos,
  alto = 460,
  activo = null,
  onSeleccionar,
  estatico = false,
}: ParkMapProps) {
  const contenedor = useRef<HTMLDivElement>(null)
  const mapa = useRef<L.Map | null>(null)
  const marcadores = useRef<Map<number, L.Marker>>(new Map())

  // Creación del mapa: una sola vez.
  useEffect(() => {
    if (!contenedor.current || mapa.current) return

    const m = L.map(contenedor.current, {
      center: CENTRO_PARQUE,
      zoom: 16,
      scrollWheelZoom: false, // no secuestra el desplazamiento de la página
      zoomControl: !estatico,
      dragging: !estatico,
      doubleClickZoom: !estatico,
      touchZoom: !estatico,
      keyboard: !estatico,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; colaboradores de OpenStreetMap',
    }).addTo(m)

    mapa.current = m

    return () => {
      m.remove()
      mapa.current = null
      marcadores.current.clear()
    }
  }, [estatico])

  // Marcadores: se rehacen cuando cambian los puntos.
  useEffect(() => {
    const m = mapa.current
    if (!m) return

    for (const marcador of marcadores.current.values()) marcador.remove()
    marcadores.current.clear()

    puntos.forEach((punto, i) => {
      const icono = L.divIcon({
        className: 'park-marker-wrap',
        html: `<span class="park-marker">${i + 1}</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marcador = L.marker([punto.lat, punto.lng], {
        icon: icono,
        title: punto.nombre,
        keyboard: false,
      }).addTo(m)

      marcador.bindPopup(
        `<strong>${escapar(punto.nombre)}</strong>${
          punto.zona ? `<br><span style="color:#5a5a56">${escapar(punto.zona)}</span>` : ''
        }`,
      )

      if (onSeleccionar) {
        marcador.on('click', () => onSeleccionar(punto.id))
      }

      marcadores.current.set(punto.id, marcador)
    })

    // Encuadra el mapa para que se vean todos los puntos.
    if (puntos.length > 0) {
      const limites = L.latLngBounds(puntos.map((p) => [p.lat, p.lng] as [number, number]))
      m.fitBounds(limites, { padding: [40, 40], maxZoom: 17 })
    }
  }, [puntos, onSeleccionar])

  // Resalta y centra el punto elegido desde fuera.
  useEffect(() => {
    if (activo === null) return
    const marcador = marcadores.current.get(activo)
    const m = mapa.current
    if (!marcador || !m) return
    m.panTo(marcador.getLatLng())
    marcador.openPopup()
  }, [activo])

  return <div ref={contenedor} className="park-map" style={{ height: alto }} />
}

/** El nombre viene de la base de datos y se inserta como HTML en el globo. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
