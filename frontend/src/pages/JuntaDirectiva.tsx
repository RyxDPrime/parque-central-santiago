import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

export function JuntaDirectiva() {
  const { data, loading, error } = useApiData(api.getJuntaDirectiva)
  // Mientras no haya sesión de fotos de la Junta, se muestran los logos de
  // las instituciones. El panel puede cambiarlo cuando las fotos estén listas.
  const mostrarFoto = useTextos()('junta.modo') === 'foto'

  return (
    <>
      <PageHero
        label="Institución"
        title="Junta Directiva"
        description="Las instituciones que conforman el Patronato para la Administración del Parque Central de Santiago."
        image="/images/galeria/vista-aerea-parque.jpg"
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
                    {mostrarFoto && member.fotoUrl ? (
                      <img src={member.fotoUrl} alt={member.representante} loading="lazy" />
                    ) : member.logoUrl ? (
                      <img
                        className="leadership-photo-logo"
                        src={member.logoUrl}
                        alt={member.institucion}
                        loading="lazy"
                      />
                    ) : (
                      <i className="ti ti-building-bank" />
                    )}

                    {/* Con foto de la persona, el logo pasa a un sello en la
                        esquina: manda el rostro, sin perder la institución. */}
                    {mostrarFoto && member.fotoUrl && member.logoUrl && (
                      <span className="leadership-logo-badge">
                        <img src={member.logoUrl} alt={member.institucion} loading="lazy" />
                      </span>
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
