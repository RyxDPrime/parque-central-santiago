import { useEffect, useRef } from 'react'
import type { Actividad } from '../api/client'

const fechaLarga = new Intl.DateTimeFormat('es-DO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

interface ActividadModalProps {
  actividad: Actividad
  onClose: () => void
}

/** Fecha o rango de fechas de la actividad, escrito completo. */
function rangoLargo(actividad: Actividad): string {
  const inicio = fechaLarga.format(new Date(actividad.fechaInicio))
  if (!actividad.fechaFin) return inicio
  const fin = fechaLarga.format(new Date(actividad.fechaFin))
  return inicio === fin ? inicio : `Del ${inicio} al ${fin}`
}

/**
 * Detalle de una actividad de la agenda.
 *
 * En la lista solo caben el título, la fecha y el lugar; aquí se ve todo,
 * incluida la foto y la descripción completa, sin salir de la página.
 */
export function ActividadModal({ actividad, onClose }: ActividadModalProps) {
  const cerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Se lleva el foco al diálogo para que quien navega con teclado no siga
    // detrás, en la lista que quedó tapada.
    cerrar.current?.focus()

    function alPulsar(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', alPulsar)

    // Se bloquea el desplazamiento del fondo mientras el diálogo está abierto.
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.style.overflow = previo
    }
  }, [onClose])

  return (
    <div
      className="actividad-modal-fondo"
      role="presentation"
      // Solo cierra si el clic fue en el fondo, no dentro de la tarjeta.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="actividad-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="actividad-modal-titulo"
      >
        <button
          ref={cerrar}
          type="button"
          className="actividad-modal-cerrar"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <i className="ti ti-x" />
        </button>

        {actividad.imagenUrl && (
          <div className="actividad-modal-foto">
            <img src={actividad.imagenUrl} alt="" aria-hidden="true" />
          </div>
        )}

        <div className="actividad-modal-cuerpo">
          <span className="agenda-range">{rangoLargo(actividad)}</span>
          <h2 id="actividad-modal-titulo">{actividad.titulo}</h2>

          {actividad.lugar && (
            <p className="agenda-lugar">
              <i className="ti ti-map-pin" /> {actividad.lugar}
            </p>
          )}

          {actividad.descripcion ? (
            <p className="actividad-modal-desc">{actividad.descripcion}</p>
          ) : (
            <p className="actividad-modal-desc is-vacio">
              Todavía no hay más detalles publicados sobre esta actividad.
            </p>
          )}

          <p className="actividad-modal-nota">
            <i className="ti ti-info-circle" /> Para más información, escríbenos desde la página de
            contacto.
          </p>
        </div>
      </div>
    </div>
  )
}
