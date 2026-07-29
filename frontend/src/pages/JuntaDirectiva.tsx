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
            <div className="board-card-grid">
              {data.map((member) => (
                <div className="board-card" key={member.id}>
                  <div className="board-card-logo">
                    {member.logoUrl ? (
                      <img src={member.logoUrl} alt={member.institucion} />
                    ) : (
                      <i className="ti ti-building-bank" />
                    )}
                  </div>
                  <div className="board-card-body">
                    <span className="board-card-cargo">{member.cargo}</span>
                    <h3>{member.institucion}</h3>
                    <p>{member.representante}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
