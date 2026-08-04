import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type GaleriaItem } from '../api/client'

export function Galeria() {
  const { data, loading, error } = useApiData(api.getGaleria)
  const [active, setActive] = useState<GaleriaItem | null>(null)

  return (
    <>
      <PageHero
        label="El Parque"
        title="Galería multimedia"
        description="Fotografías del Parque Central de Santiago y sus espacios."
        image="/images/galeria/parque-infantil.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && data.length === 0 && (
            <EmptyState
              icon="ti-photo"
              title="Galería en preparación"
              description="Estamos incorporando las fotografías reales del parque. Muy pronto podrás recorrerlo visualmente desde aquí."
            />
          )}

          {data && data.length > 0 && (
            <div className="gallery-grid">
              {data.map((item) => (
                <button type="button" key={item.id} className="gallery-tile" onClick={() => setActive(item)}>
                  {item.tipo === 'imagen' ? (
                    <img src={item.url} alt={item.titulo ?? 'Fotografía del parque'} loading="lazy" />
                  ) : (
                    <video src={item.url} muted />
                  )}
                  <span className="gallery-tile-overlay">
                    <i className={`ti ${item.tipo === 'video' ? 'ti-player-play' : 'ti-zoom-in'}`} />
                    {item.titulo && <span>{item.titulo}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button type="button" className="lightbox-close" aria-label="Cerrar" onClick={() => setActive(null)}>
            <i className="ti ti-x" />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {active.tipo === 'imagen' ? (
              <img src={active.url} alt={active.titulo ?? 'Fotografía del parque'} />
            ) : (
              <video src={active.url} controls autoPlay />
            )}
            {active.titulo && <p>{active.titulo}</p>}
          </div>
        </div>
      )}
    </>
  )
}
