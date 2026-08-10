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
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {/* Sin biografías, la cuadrícula aprovecha mejor el espacio que las
              filas intercaladas, que dejaban un hueco grande junto a la foto. */}
          {data && data.length > 0 && (
            <div className="staff-card-grid">
              {data.map((persona) => (
                <article className="staff-card" key={persona.id}>
                  <div className="staff-card-foto">
                    {persona.fotoUrl ? (
                      <img src={persona.fotoUrl} alt={persona.nombre} loading="lazy" />
                    ) : (
                      <i className="ti ti-user" />
                    )}
                  </div>
                  <h3>{persona.nombre}</h3>
                  <span className="staff-card-cargo">{persona.cargo}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
