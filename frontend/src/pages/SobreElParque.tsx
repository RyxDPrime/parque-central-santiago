import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

export function SobreElParque() {
  const { data: hitos, loading, error } = useApiData(api.getHitos)
  const texto = useTextos()

  return (
    <>
      <PageHero
        label="Sobre el Parque"
        title="Casi 20 años de gestión hechos realidad"
        description="La historia del Parque Central de Santiago y su relación con la Asociación para el Desarrollo, Inc. (APEDI)."
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="story-hero">
            <img src="/images/galeria/entrada-parque.jpg" alt="Entrada del Parque Central de Santiago" />
          </div>

          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {hitos && hitos.length > 0 && (
            <div className="story-timeline">
              {hitos.map((hito) => (
                <div className="story-hito" key={hito.id}>
                  <span className="story-hito-fecha">{hito.fecha}</span>
                  <h3>{hito.titulo}</h3>
                  <p>{hito.texto}</p>
                </div>
              ))}
            </div>
          )}

          <div className="transparency-intro" style={{ marginTop: 28 }}>
            <div className="transparency-intro-icon">
              <i className="ti ti-handshake" />
            </div>
            <div>
              <h3>Relación con APEDI</h3>
              <p>{texto('historia.apedi')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
