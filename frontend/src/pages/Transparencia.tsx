import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function Transparencia() {
  return (
    <>
      <PageHero
        label="Institución"
        title="Transparencia"
        description="Quiénes somos y el marco bajo el que opera el Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <div className="legal-card" style={{ marginBottom: 24 }}>
            <h3>
              <i className="ti ti-building-bank" /> Quiénes somos
            </h3>
            <p>
              El Parque Central de Santiago es administrado por el Patronato para la
              Administración del Parque Central de Santiago, una entidad sin fines de lucro
              constituida el 6 de abril de 2018, resultado del esfuerzo conjunto entre la
              Asociación para el Desarrollo, Inc. (APEDI) y diecisiete instituciones públicas y
              privadas de la región.
            </p>
          </div>

          <div className="legal-grid">
            <div className="legal-card">
              <h3>
                <i className="ti ti-scale" /> Marco normativo
              </h3>
              <p>
                El Patronato está registrado bajo la Ley 122-05 del 8 de abril de 2005, que regula
                las asociaciones sin fines de lucro en la República Dominicana. RNC: 430-25261-1.
              </p>
            </div>
            <EmptyState
              icon="ti-chart-pie"
              title="Gestión económica"
              description="Los informes de gestión económica del Patronato se publicarán en una fase posterior del proyecto."
            />
            <EmptyState
              icon="ti-heart-handshake"
              title="Uso de donaciones"
              description="El detalle sobre el uso de las donaciones recibidas se publicará en una fase posterior del proyecto."
            />
            <EmptyState
              icon="ti-file-certificate"
              title="Código de ética"
              description="El código de ética institucional se publicará en cuanto el Parque lo confirme."
            />
          </div>
        </div>
      </section>
    </>
  )
}
