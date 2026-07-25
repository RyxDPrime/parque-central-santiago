import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function Galeria() {
  const { data, loading, error } = useApiData(api.getGaleria)

  return (
    <>
      <PageHero
        label="El Parque"
        title="Galería multimedia"
        description="Fotografías del Parque Central de Santiago y sus espacios."
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
            <div className="card-grid">
              {data.map((item) => (
                <div key={item.id} className="info-card gallery-card">
                  {item.tipo === 'imagen' ? (
                    <img src={item.url} alt={item.titulo ?? 'Fotografía del parque'} />
                  ) : (
                    <video src={item.url} controls />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
