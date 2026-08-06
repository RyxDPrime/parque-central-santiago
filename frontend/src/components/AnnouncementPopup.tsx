import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

const CLAVE = 'pcs_anuncio_visto'

const fechaFormatter = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * Ventana emergente con la publicación marcada para anunciar. Se muestra al
 * entrar al inicio y no vuelve a salir hasta que se publique otra distinta.
 */
export function AnnouncementPopup() {
  const { data } = useApiData(api.getPublicaciones)
  const [cerrado, setCerrado] = useState(false)

  const anuncio = data?.find((p) => p.destacada) ?? null

  useEffect(() => {
    if (!anuncio) return
    if (localStorage.getItem(CLAVE) === String(anuncio.id)) {
      setCerrado(true)
    }
  }, [anuncio])

  if (!anuncio || cerrado) return null

  function cerrar() {
    if (anuncio) localStorage.setItem(CLAVE, String(anuncio.id))
    setCerrado(true)
  }

  return (
    <div className="anuncio-overlay" onClick={cerrar} role="dialog" aria-modal="true">
      <div className="anuncio-card" onClick={(e) => e.stopPropagation()}>
        <div className="anuncio-head">
          <img src="/images/brand/logo-pcs.png" alt="Parque Central de Santiago" />
          <button type="button" onClick={cerrar} aria-label="Cerrar anuncio">
            <i className="ti ti-x" />
          </button>
        </div>

        {anuncio.imagenUrl && (
          <img className="anuncio-img" src={anuncio.imagenUrl} alt="" />
        )}

        <div className="anuncio-cuerpo">
          <span className="anuncio-fecha">
            {fechaFormatter.format(new Date(anuncio.fecha))} ·{' '}
            {anuncio.tipo === 'articulo' ? 'Artículo' : 'Noticia'}
          </span>
          <h2>{anuncio.titulo}</h2>
          <p>{anuncio.resumen?.trim() || anuncio.contenido}</p>

          <div className="anuncio-acciones">
            <Link to="/blog" className="btn-primary" onClick={cerrar}>
              Ver en el blog <i className="ti ti-arrow-right" />
            </Link>
            <button type="button" className="anuncio-cerrar-texto" onClick={cerrar}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
