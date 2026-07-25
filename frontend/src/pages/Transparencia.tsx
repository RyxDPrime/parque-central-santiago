import { PageHero } from '../components/PageHero'

export function Transparencia() {
  return (
    <>
      <PageHero
        label="Institución"
        title="Transparencia"
        description="Quiénes somos y el marco legal bajo el que opera el Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <div className="legal-grid">
            <div className="legal-card">
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
            <div className="legal-card">
              <h3>
                <i className="ti ti-scale" /> Marco legal
              </h3>
              <p>
                El Patronato está registrado bajo la Ley 122-05 del 8 de abril de 2005, que regula
                las asociaciones sin fines de lucro en la República Dominicana. RNC:
                430-25261-1.
              </p>
            </div>
          </div>

          <div className="empty-state" style={{ marginTop: 24 }}>
            <i className="ti ti-file-certificate" />
            <h3>Transparencia institucional completa</h3>
            <p>
              El portal ampliado de rendición de cuentas —gestión económica, uso de donaciones y
              código de ética— se incorporará en una fase posterior del proyecto.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
