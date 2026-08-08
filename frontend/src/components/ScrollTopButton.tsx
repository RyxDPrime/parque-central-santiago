import { useEffect, useState } from 'react'

/** Botón flotante que aparece al bajar y devuelve al tope de la página. */
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function alDesplazar() {
      setVisible(window.scrollY > 400)
    }
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="scroll-top"
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
      onClick={() =>
        window.scrollTo({
          top: 0,
          // Respeta la preferencia de reducir movimiento del sistema.
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
    >
      <i className="ti ti-arrow-up" />
    </button>
  )
}
