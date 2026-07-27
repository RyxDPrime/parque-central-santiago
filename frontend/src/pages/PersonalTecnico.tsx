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
            <div className="board-list">
              <div className="board-row header" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <span>Nombre</span>
                <span>Cargo</span>
              </div>
              {data.map((persona) => (
                <div className="board-row" key={persona.id} style={{ gridTemplateColumns: '2fr 1fr' }}>
                  <span className="institucion">{persona.nombre}</span>
                  <span className="cargo">{persona.cargo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
