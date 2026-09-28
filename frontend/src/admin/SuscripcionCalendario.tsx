import { useState } from 'react'

/**
 * La dirección para ver las reservas aprobadas en el calendario propio.
 *
 * Quien atiende las reservas vive con el teléfono en la mano, no con el panel
 * abierto. Suscribirse una vez hace que cada reserva aprobada aparezca sola en
 * su Google Calendar o en el del iPhone, junto a sus demás compromisos, y que
 * desaparezca si se cancela.
 *
 * Plegado por omisión: se usa una vez por persona, y abierto ocuparía media
 * pantalla en una bandeja que se abre a diario.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export function SuscripcionCalendario() {
  const direccion = `${API_URL.replace(/\/+$/, '')}/calendario/reservas.ics`
  // webcal:// es la misma dirección con otro nombre: le dice al teléfono que
  // la abra con la aplicación de calendario en vez de descargar el archivo.
  const webcal = direccion.replace(/^https?:\/\//, 'webcal://')
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(direccion)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Sin permiso para el portapapeles, la dirección queda seleccionable a mano.
    }
  }

  return (
    <details className="suscripcion">
      <summary>
        <i className="ti ti-calendar-share" aria-hidden="true" />
        Ver las reservas aprobadas en tu propio calendario
      </summary>
      <div className="suscripcion-cuerpo">
        <p>
          Suscríbete una vez y cada reserva que se apruebe aparece sola en tu calendario del
          teléfono o de la computadora. Si se cancela, desaparece. Solo lleva el espacio, el
          horario y el tipo de actividad: quién la pidió se sigue viendo aquí.
        </p>

        <div className="suscripcion-direccion">
          <input
            id="suscripcion-url"
            type="text"
            readOnly
            value={direccion}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Dirección de suscripción"
          />
          <button type="button" className="btn-outline" onClick={copiar}>
            <i className={`ti ${copiado ? 'ti-check' : 'ti-copy'}`} />
            {copiado ? 'Copiada' : 'Copiar'}
          </button>
        </div>

        <ul className="suscripcion-pasos">
          <li>
            <b>iPhone o Mac:</b> <a href={webcal}>ábrelo aquí</a> y confirma la suscripción.
          </li>
          <li>
            <b>Google Calendar:</b> en la computadora, junto a «Otros calendarios» pulsa{' '}
            <b>+</b> → <b>Desde URL</b>, pega la dirección y pulsa <b>Agregar calendario</b>.
          </li>
          <li>
            <b>Outlook:</b> <b>Agregar calendario</b> → <b>Suscribirse desde la web</b>, y pega la
            dirección.
          </li>
        </ul>
        <p className="suscripcion-nota">
          Google Calendar revisa la dirección cada varias horas, no al instante: una reserva
          recién aprobada puede tardar en aparecer.
        </p>
      </div>
    </details>
  )
}
