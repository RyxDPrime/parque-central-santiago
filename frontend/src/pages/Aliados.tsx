import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function Aliados() {
  const { data, loading, error } = useApiData(api.getAliados)

  return (
    <>
      <PageHero
        label="Institución"
        title="Aliados y Patrocinadores"
        description="Las instituciones que conforman la Junta Directiva del Patronato y acompañan la gestión del parque."
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && (
            <div className="allies-grid">
              {data.map((ally) => (
                <div className="ally-card" key={ally.id}>
                  {ally.logoUrl ? (
                    <img src={ally.logoUrl} alt={ally.nombre} className="ally-logo" />
                  ) : (
                    <i className="ti ti-building-bank" />
                  )}
                  <span>{ally.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
