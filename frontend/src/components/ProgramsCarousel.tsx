import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'
import { fotoDePrograma } from '../api/programas'

/**
 * Carrusel de programas de la portada.
 *
 * Los cuatro que enseñaba estaban escritos aquí, con su foto y su categoría:
 * era la tercera copia de la misma información —las otras dos vivían en
 * Instalaciones y en Programas— y la única que el Parque no podía tocar. Ya se
 * había quedado vieja: mostraba cuatro de los seis programas cargados, y la
 * tirolesa con la foto de los ciclistas.
 *
 * Ahora sale de la misma lista que la página de Programas y Servicios. Lo que
 * el Parque cargue o reordene desde el panel se ve aquí sin tocar nada.
 */
export function ProgramsCarousel() {
  const { data } = useApiData(api.getProgramas)
  const programas = data ?? []
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // El intervalo se rearma cuando cambia la cantidad: al llegar la lista, el
  // que estaba corriendo daba la vuelta sobre cero diapositivas.
  useEffect(() => {
    if (programas.length === 0) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % programas.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [programas.length])

  function goTo(index: number) {
    if (programas.length === 0) return
    setCurrent((index + programas.length) % programas.length)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % programas.length)
    }, 6000)
  }

  // Sin programas no hay carrusel: es preferible a un recuadro negro vacío
  // ocupando media portada.
  if (programas.length === 0) return null

  return (
    <div className="prog-wrap">
      {programas.map((programa, i) => (
        <div key={programa.id} className={`prog-slide${i === current ? ' active' : ''}`}>
          <img src={fotoDePrograma(programa)} alt={programa.nombre} className="prog-slide-bg" />
          <div className="prog-overlay" />
          <div className="prog-content">
            <div className="prog-label">{programa.categoria}</div>
            <h3 className="prog-title">{programa.nombre}</h3>
            <Link to="/programas-y-servicios" className="prog-btn">
              Conocer más <i className="ti ti-arrow-right" />
            </Link>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="prog-nav prev"
        aria-label="Programa anterior"
        onClick={() => goTo(current - 1)}
      >
        <i className="ti ti-chevron-left" />
      </button>
      <button
        type="button"
        className="prog-nav next"
        aria-label="Siguiente programa"
        onClick={() => goTo(current + 1)}
      >
        <i className="ti ti-chevron-right" />
      </button>

      <div className="prog-indicators">
        {programas.map((programa, i) => (
          <button
            key={programa.id}
            type="button"
            className={`prog-dot${i === current ? ' active' : ''}`}
            aria-label={`Ver ${programa.nombre}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
