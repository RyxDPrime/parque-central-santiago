import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

/**
 * Carrusel grande de la portada.
 *
 * Tiene su propia lista, administrada desde el panel en Página de inicio →
 * Carrusel del Inicio. No sale de los programas a propósito: la lista de
 * programas es el catálogo completo del parque, y esto es una selección
 * editorial de la portada. Atados, agregar un programa lo metía en la portada
 * sin que nadie lo decidiera, y la foto buena para una tarjeta tenía que servir
 * también de fondo a pantalla completa.
 *
 * Antes las cuatro diapositivas estaban escritas aquí, con su foto y su
 * categoría, y el Parque no podía tocarlas.
 */
export function ProgramsCarousel() {
  const { data } = useApiData(api.getDestacadosInicio)
  const destacados = data ?? []
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // El intervalo se rearma cuando cambia la cantidad: al llegar la lista, el
  // que estaba corriendo daba la vuelta sobre cero diapositivas.
  useEffect(() => {
    if (destacados.length === 0) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % destacados.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [destacados.length])

  function goTo(index: number) {
    if (destacados.length === 0) return
    setCurrent((index + destacados.length) % destacados.length)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % destacados.length)
    }, 6000)
  }

  // Sin diapositivas no hay carrusel: es preferible a un recuadro negro vacío
  // ocupando media portada.
  if (destacados.length === 0) return null

  return (
    <div className="prog-wrap">
      {destacados.map((destacado, i) => (
        <div key={destacado.id} className={`prog-slide${i === current ? ' active' : ''}`}>
          <img
            src={destacado.imagenUrl || '/images/galeria/entrada-parque.jpg'}
            alt={destacado.titulo}
            className="prog-slide-bg"
          />
          <div className="prog-overlay" />
          <div className="prog-content">
            <div className="prog-label">{destacado.categoria}</div>
            <h3 className="prog-title">{destacado.titulo}</h3>
            {destacado.enlaceUrl && (
              <Link to={destacado.enlaceUrl} className="prog-btn">
                {destacado.enlaceTexto || 'Conocer más'} <i className="ti ti-arrow-right" />
              </Link>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="prog-nav prev"
        aria-label="Anterior"
        onClick={() => goTo(current - 1)}
      >
        <i className="ti ti-chevron-left" />
      </button>
      <button
        type="button"
        className="prog-nav next"
        aria-label="Siguiente"
        onClick={() => goTo(current + 1)}
      >
        <i className="ti ti-chevron-right" />
      </button>

      <div className="prog-indicators">
        {destacados.map((destacado, i) => (
          <button
            key={destacado.id}
            type="button"
            className={`prog-dot${i === current ? ' active' : ''}`}
            aria-label={`Ver ${destacado.titulo}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
