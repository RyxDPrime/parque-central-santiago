import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'

const formas = [
  {
    icon: 'ti-hand-heart',
    tag: 'Voluntariado',
    titulo: 'Ser voluntario',
    texto: 'Súmate a las jornadas de mantenimiento, educación ambiental y actividades comunitarias del parque.',
  },
  {
    icon: 'ti-coin',
    tag: 'Donaciones',
    titulo: 'Hacer una donación',
    texto: 'Tu aporte ayuda a mantener las instalaciones y los programas del parque. Próximamente habilitaremos donaciones en línea.',
  },
  {
    icon: 'ti-plant-2',
    tag: 'Reforestación',
    titulo: 'Donar un árbol o una flor',
    texto: 'Contribuye a la reforestación y el embellecimiento del parque dedicando un árbol o una flor.',
  },
]

export function Apoyanos() {
  return (
    <>
      <PageHero
        label="Apóyanos"
        title="¿Quieres apoyar al parque?"
        description="Cada donación, árbol o hora de voluntariado hace posible que este espacio siga vivo para las próximas generaciones."
        image="/images/galeria/ciclistas.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="support-grid">
            {formas.map((forma) => (
              <div className="support-card" key={forma.titulo}>
                <div className="support-card-icon">
                  <i className={`ti ${forma.icon}`} />
                </div>
                <span className="support-card-tag">{forma.tag}</span>
                <h3>{forma.titulo}</h3>
                <p>{forma.texto}</p>
                <Link to="/contacto" className="btn-outline">
                  Escríbenos <i className="ti ti-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
