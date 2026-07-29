import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function PersonalTecnico() {
  const { data, loading, error } = useApiData(api.getPersonalTecnico)

  return (
    <>
      <PageHero
        label="Institución"
        title="Personal Técnico"
        description="El equipo administrativo y técnico del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && (
            <div className="staff-card-grid">
              {data.map((persona) => (
                <div className="staff-card" key={persona.id}>
                  <div className="staff-card-avatar">
                    {persona.fotoUrl ? (
                      <img src={persona.fotoUrl} alt={persona.nombre} />
                    ) : (
                      <i className="ti ti-user" />
                    )}
                  </div>
                  <h3>{persona.nombre}</h3>
                  <span className="staff-card-cargo">{persona.cargo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
