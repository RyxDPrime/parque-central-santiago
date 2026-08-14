import { PageHero } from '../components/PageHero'
import { LogoCarousel } from '../components/LogoCarousel'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

export function SobreElParque() {
  const { data: hitos, loading, error } = useApiData(api.getHitos)
  const { data: aliados } = useApiData(api.getAliados)
  const texto = useTextos()

  // El panel decide si la historia se cuenta como línea de tiempo o como un
  // solo texto corrido.
  const enParrafo = texto('historia.modo') === 'parrafo'
  const parrafo = texto('historia.parrafo')

  return (
    <>
      <PageHero
        pagina="sobre-el-parque"
        label="Sobre el Parque"
        title="Casi 20 años de gestión hechos realidad"
        description="La historia del Parque Central de Santiago y su relación con la Asociación para el Desarrollo, Inc. (APEDI)."
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {/* Las instituciones que conforman el Patronato, en una barra
              desplazable. Antes era una foto del letrero con todos los logos. */}
          {aliados && aliados.length > 0 && (
            <div className="story-aliados">
              <p className="story-aliados-titulo">Instituciones que conforman el Patronato</p>
              <LogoCarousel logos={aliados} />
            </div>
          )}

          {enParrafo ? (
            <article className="story-parrafo">
              {/* Cada bloque separado por una línea en blanco es un párrafo:
                  el texto viene del panel y allí se escribe así. */}
              {parrafo
                .split(/\n\s*\n/)
                .map((bloque) => bloque.trim())
                .filter(Boolean)
                .map((bloque, i) => (
                  <p key={i}>{bloque}</p>
                ))}
            </article>
          ) : (
            <>
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
            </>
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
