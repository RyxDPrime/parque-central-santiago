import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    label: 'Programa deportivo · Fútbol',
    title: 'Cibao Fútbol Club',
    img: '/images/galeria/cibao-futbol-club.jpg',
  },
  {
    label: 'Programa deportivo · Tenis',
    title: 'Escuela de Tenis',
    img: '/images/galeria/cancha-tenis.jpg',
  },
  {
    label: 'Aventura familiar',
    title: 'Tirolesa',
    img: '/images/galeria/ciclistas.jpg',
  },
  {
    label: 'Recreación infantil',
    title: 'Fun Stop',
    img: '/images/galeria/funstop.jpg',
  },
]

export function ProgramsCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function goTo(index: number) {
    setCurrent((index + slides.length) % slides.length)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 6000)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="prog-wrap">
      {slides.map((slide, i) => (
        <div key={slide.title} className={`prog-slide${i === current ? ' active' : ''}`}>
          <img src={slide.img} alt={slide.title} className="prog-slide-bg" />
          <div className="prog-overlay" />
          <div className="prog-content">
            <div className="prog-label">{slide.label}</div>
            <h3 className="prog-title">{slide.title}</h3>
            <Link to="/instalaciones-y-servicios" className="prog-btn">
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
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            className={`prog-dot${i === current ? ' active' : ''}`}
            aria-label={`Ver ${slide.title}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
