import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

const BIO_PLACEHOLDER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

export function PersonalTecnico() {
  const { data, loading, error } = useApiData(api.getPersonalTecnico)

  return (
    <>
      <PageHero
        label="Institución"
        title="Personal Técnico"
        description="El equipo administrativo y técnico del Parque Central de Santiago."
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && (
            <div className="staff-zigzag">
              {data.map((persona, i) => (
                <article
                  className={`staff-zigzag-row${i % 2 === 1 ? ' reverse' : ''}`}
                  key={persona.id}
                >
                  <div className="staff-zigzag-photo">
                    {persona.fotoUrl ? (
                      <img src={persona.fotoUrl} alt={persona.nombre} loading="lazy" />
                    ) : (
                      <i className="ti ti-user" />
                    )}
                  </div>
                  <div className="staff-zigzag-text">
                    <h3>{persona.nombre}</h3>
                    <span className="staff-zigzag-cargo">{persona.cargo}</span>
                    {persona.bio ? (
                      <p>{persona.bio}</p>
                    ) : (
                      <p className="staff-zigzag-bio-placeholder">{BIO_PLACEHOLDER}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
