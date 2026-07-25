import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function JuntaDirectiva() {
  const { data, loading, error } = useApiData(api.getJuntaDirectiva)

  return (
    <>
      <PageHero
        label="Institución"
        title="Junta Directiva"
        description="Las instituciones que conforman el Patronato para la Administración del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && (
            <div className="board-list">
              <div className="board-row header">
                <span>Institución</span>
                <span>Representante</span>
                <span>Cargo</span>
              </div>
              {data.map((member) => (
                <div className="board-row" key={member.id}>
                  <span className="institucion">{member.institucion}</span>
                  <span className="representante">{member.representante}</span>
                  <span className="cargo">{member.cargo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
