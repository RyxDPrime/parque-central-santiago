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
            <div className="leadership-grid">
              {data.map((member) => (
                <article className="leadership-card" key={member.id}>
                  <div className="leadership-photo">
                    {member.fotoUrl ? (
                      <img src={member.fotoUrl} alt={member.representante} loading="lazy" />
                    ) : member.logoUrl ? (
                      <img
                        className="leadership-photo-logo"
                        src={member.logoUrl}
                        alt={member.institucion}
                        loading="lazy"
                      />
                    ) : (
                      <i className="ti ti-user" />
                    )}
                  </div>
                  <h3>{member.representante}</h3>
                  <p className="leadership-org">{member.institucion}</p>
                  <p className="leadership-cargo">{member.cargo}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
