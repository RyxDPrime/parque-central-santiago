import { PageHero } from '../components/PageHero'

export function Apoyanos() {
  return (
    <>
      <PageHero
        label="Apóyanos"
        title="¿Quieres apoyar al parque?"
        description="Cada donación, árbol o hora de voluntariado hace posible que este espacio siga vivo para las próximas generaciones."
      />

      <section className="section">
        <div className="section-inner">
          <div className="card-grid">
            <div className="info-card">
              <span className="tag">Voluntariado</span>
              <h3 style={{ marginBottom: 8 }}>Ser voluntario</h3>
              <p>
                Súmate a las jornadas de mantenimiento, educación ambiental y actividades
                comunitarias del parque. Escríbenos por Contacto para más información.
              </p>
            </div>
            <div className="info-card">
              <span className="tag">Donaciones</span>
              <h3 style={{ marginBottom: 8 }}>Hacer una donación</h3>
              <p>
                Tu aporte ayuda a mantener las instalaciones y los programas del parque.
                Próximamente habilitaremos donaciones en línea; mientras tanto, contáctanos
                directamente.
              </p>
            </div>
            <div className="info-card">
              <span className="tag">Reforestación</span>
              <h3 style={{ marginBottom: 8 }}>Donar un árbol o una flor</h3>
              <p>
                Contribuye a la reforestación y el embellecimiento del parque. Escríbenos por
                Contacto si quieres dedicar un árbol o una flor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
