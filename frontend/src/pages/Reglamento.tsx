import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function Reglamento() {
  const { data: normas, loading, error } = useApiData(api.getNormas)

  return (
    <>
      <PageHero
        pagina="reglamento"
        label="Sobre Nosotros"
        title="Reglamento General"
        description="Normas de uso del Parque Central de Santiago, para preservar un ambiente seguro, limpio y agradable para todos los visitantes."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {normas && normas.length > 0 && (
            <div className="facility-icon-grid">
              {normas.map((norma) => (
                <div className="facility-icon-card" key={norma.id}>
                  <div className="facility-icon-badge">
                    <i className={`ti ${norma.icono}`} />
                  </div>
                  <div>
                    <div className="facility-icon-head">
                      <h3>{norma.titulo}</h3>
                    </div>
                    <p>{norma.texto}</p>
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
