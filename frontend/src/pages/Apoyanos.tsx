import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'
import { tipoDeApoyo } from '../api/apoyo'

export function Apoyanos() {
  const { data: formas, loading, error } = useApiData(api.getFormasApoyo)
  const formasOrdenadas = formas
    ? [...formas].sort((a, b) => {
        const prioridad = (forma: typeof a) => {
          const tipo = tipoDeApoyo(forma)
          if (tipo === 'dinero') return 0
          if (tipo === 'voluntariado') return 1
          return 2
        }
        return prioridad(a) - prioridad(b)
      })
    : null

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

          {formasOrdenadas && formasOrdenadas.length > 0 && (
            <div className="support-grid">
              {formasOrdenadas.map((forma) => {
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
