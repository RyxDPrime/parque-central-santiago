import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

export function Apoyanos() {
  const { data: formas, loading, error } = useApiData(api.getFormasApoyo)

  return (
    <>
      <PageHero
        pagina="apoyanos"
        label="Apóyanos"
        title="¿Quieres apoyar al parque?"
        description="Cada donación, árbol o hora de voluntariado hace posible que este espacio siga vivo para las próximas generaciones."
        image="/images/galeria/ciclistas.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {formas && formas.length > 0 && (
            <div className="support-grid">
              {formas.map((forma) => (
                <div className="support-card" key={forma.id}>
                  <div className="support-card-icon">
                    <i className={`ti ${forma.icono}`} />
                  </div>
                  <span className="support-card-tag">{forma.etiqueta}</span>
                  <h3>{forma.titulo}</h3>
                  <p>{forma.texto}</p>
                  <Link to="/contacto" className="btn-outline">
                    Escríbenos <i className="ti ti-arrow-right" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
