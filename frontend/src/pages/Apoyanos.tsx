import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type FormaApoyo, type TipoAporte } from '../api/client'

/**
 * A qué opción del formulario lleva cada tarjeta.
 *
 * Se deduce de la etiqueta que el Parque le puso a la forma de apoyo, que es
 * justo el campo que la clasifica. Sin esto, «Ser voluntario» y «Hacer una
 * donación» llevaban al mismo sitio y abrían los dos en la opción de dinero:
 * quien venía a ofrecer horas tenía que darse cuenta solo de que había que
 * cambiarla.
 *
 * Si mañana renombran la etiqueta y deja de coincidir, el botón sigue llevando
 * al formulario, solo que sin nada preseleccionado. Es un fallo que no rompe
 * nada, y por eso se prefiere a obligar al Parque a mantener un campo más.
 */
function tipoDeApoyo(forma: FormaApoyo): TipoAporte | null {
  const texto = `${forma.etiqueta} ${forma.titulo}`.toLowerCase()
  if (texto.includes('volunt')) return 'voluntariado'
  if (texto.includes('patrocin')) return 'patrocinio'
  if (texto.includes('donac') || texto.includes('aporte')) return 'dinero'
  return null
}

export function Apoyanos() {
  const { data: formas, loading, error } = useApiData(api.getFormasApoyo)

  return (
    <>
      <PageHero
        pagina="apoyanos"
        label="Apóyanos"
        title="¿Quieres apoyar al parque?"
        description="Cada donación y cada hora de voluntariado hacen posible que este espacio siga vivo para las próximas generaciones."
        image="/images/galeria/ciclistas.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {formas && formas.length > 0 && (
            <div className="support-grid">
              {formas.map((forma) => {
                const tipo = tipoDeApoyo(forma)
                return (
                  <div className="support-card" key={forma.id}>
                    <div className="support-card-icon">
                      <i className={`ti ${forma.icono}`} />
                    </div>
                    <span className="support-card-tag">{forma.etiqueta}</span>
                    <h3>{forma.titulo}</h3>
                    <p>{forma.texto}</p>
                    <Link
                      to={tipo ? `/donaciones?tipo=${tipo}` : '/donaciones'}
                      className="btn-outline"
                    >
                      {tipo === 'voluntariado' ? 'Quiero ser voluntario' : 'Quiero apoyar'}{' '}
                      <i className="ti ti-arrow-right" />
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
