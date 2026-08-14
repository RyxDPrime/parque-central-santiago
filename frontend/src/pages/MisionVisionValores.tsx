import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

/**
 * Misión, visión y valores del Patronato.
 *
 * Los tres bloques son independientes: cada uno aparece solo si tiene
 * contenido. Es contenido institucional que aprueba la Junta, así que hasta que
 * lo definan la página se muestra vacía a propósito, con un aviso, en vez de
 * publicar un texto de relleno.
 */
export function MisionVisionValores() {
  const { data: valores, loading, error } = useApiData(api.getValores)
  const texto = useTextos()

  const mision = texto('institucion.mision').trim()
  const vision = texto('institucion.vision').trim()
  // El ícono también se elige desde el panel; si la clave todavía no existe se
  // usa el de siempre, para que el bloque nunca quede sin dibujo.
  const misionIcono = texto('institucion.misionIcono').trim() || 'ti-target-arrow'
  const visionIcono = texto('institucion.visionIcono').trim() || 'ti-eye'
  const hayValores = valores !== null && valores.length > 0
  const hayAlgo = Boolean(mision) || Boolean(vision) || hayValores

  return (
    <>
      <PageHero
        pagina="mision-vision-valores"
        label="El Parque"
        title="Misión, Visión y Valores"
        description="Lo que mueve al Patronato para la Administración del Parque Central de Santiago y los principios con los que trabaja."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {(mision || vision) && (
            <div className="proposito-grid">
              {mision && (
                <article className="proposito-card">
                  <div className="proposito-icon">
                    <i className={`ti ${misionIcono}`} />
                  </div>
                  <h2>Nuestra misión</h2>
                  <p>{mision}</p>
                </article>
              )}

              {vision && (
                <article className="proposito-card">
                  <div className="proposito-icon">
                    <i className={`ti ${visionIcono}`} />
                  </div>
                  <h2>Nuestra visión</h2>
                  <p>{vision}</p>
                </article>
              )}
            </div>
          )}

          {hayValores && (
            <div className="valores-bloque">
              <div className="sec-label">Nuestros valores</div>
              <h2 className="sec-title" style={{ marginBottom: 28 }}>
                Los principios con los que trabajamos
              </h2>

              <div className="facility-icon-grid">
                {valores.map((valor) => (
                  <div className="facility-icon-card" key={valor.id}>
                    <div className="facility-icon-badge">
                      <i className={`ti ${valor.icono}`} />
                    </div>
                    <div>
                      <div className="facility-icon-head">
                        <h3>{valor.titulo}</h3>
                      </div>
                      <p>{valor.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && !hayAlgo && (
            <EmptyState
              icon="ti-target-arrow"
              title="Próximamente"
              description="La misión, la visión y los valores del Parque Central de Santiago se publicarán en cuanto la Junta Directiva los apruebe."
            />
          )}
        </div>
      </section>
    </>
  )
}
