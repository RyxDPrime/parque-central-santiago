import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AlertBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div id="alert-bar">
      <i className="ti ti-clock" />
      El parque abre todos los días de 5:30 a.m. a 9:00 p.m. · Oficina administrativa: lun–vie
      8:30 a.m. – 5:00 p.m.
      <Link to="/contacto">Contáctanos →</Link>
      <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar aviso">
        <i className="ti ti-x" />
      </button>
    </div>
  )
}
