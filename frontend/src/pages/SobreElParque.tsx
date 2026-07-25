import { PageHero } from '../components/PageHero'

export function SobreElParque() {
  return (
    <>
      <PageHero
        label="Sobre el Parque"
        title="Casi 20 años de gestión hechos realidad"
        description="La historia del Parque Central de Santiago y su relación con la Asociación para el Desarrollo, Inc. (APEDI)."
      />

      <section className="section">
        <div className="section-inner">
          <div className="legal-grid">
            <div className="legal-card">
              <h3>
                <i className="ti ti-book" /> Nuestra historia
              </h3>
              <p>
                La Asociación para el Desarrollo, Inc. (APEDI) impulsó durante casi dos décadas
                las gestiones necesarias para crear el Parque Central de Santiago. El esfuerzo
                conjunto con instituciones públicas y privadas de la región culminó el 20 de
                febrero de 2018 con la inauguración del parque, y el 6 de abril de ese mismo año
                quedó formalmente constituido el Patronato para su administración.
              </p>
            </div>
            <div className="legal-card">
              <h3>
                <i className="ti ti-handshake" /> Relación con APEDI
              </h3>
              <p>
                El Parque Central de Santiago mantiene una estrecha relación con la Asociación
                para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del
                Patronato para la Administración del Parque Central de Santiago, organismo
                responsable de la gestión, administración y desarrollo del parque. Además, el
                parque trabaja de manera coordinada con diversas instituciones públicas, privadas,
                educativas y organizaciones de la sociedad civil, promoviendo alianzas
                estratégicas para el desarrollo de actividades recreativas, culturales,
                deportivas, ambientales y comunitarias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
