import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

export function AlertBar() {
  const [visible, setVisible] = useState(true)
  const { data } = useApiData(api.getPublicaciones)
  const texto = useTextos()

  if (!visible) return null

  // Si hay una publicación marcada para anunciar, manda sobre el horario.
  // Vienen ordenadas por fecha, así que la primera es la más reciente.
  const anuncio = data?.find((p) => p.destacada) ?? null

  return (
    <div id="alert-bar">
      {anuncio ? (
        <>
          <i className="ti ti-speakerphone" />
          <strong className="alert-bar-etiqueta">
            {anuncio.tipo === 'articulo' ? 'Nuevo artículo' : 'Aviso'}
          </strong>
          {anuncio.titulo}
          <Link to="/blog">Leer más →</Link>
        </>
      ) : (
        <>
          <i className="ti ti-clock" />
          El parque abre todos los días de {texto('contacto.horarioParque')} · Oficina
          administrativa: {texto('contacto.horarioOficina')}
          <Link to="/contacto">Contáctanos →</Link>
        </>
      )}
      <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar aviso">
        <i className="ti ti-x" />
      </button>
    </div>
  )
}
