import { PageHero } from '../components/PageHero'

const hitos = [
  {
    fecha: '20 feb 2018',
    titulo: 'Inauguración del parque',
    texto: 'Tras casi dos décadas de gestiones de la Asociación para el Desarrollo, Inc. (APEDI) junto a instituciones públicas y privadas de la región, el Parque Central de Santiago abre sus puertas a la comunidad.',
  },
  {
    fecha: '6 abr 2018',
    titulo: 'Constitución del Patronato',
    texto: 'Queda formalmente constituido el Patronato para la Administración del Parque Central de Santiago, la entidad sin fines de lucro responsable de su gestión, administración y desarrollo.',
  },
]

export function SobreElParque() {
  return (
    <>
      <PageHero
        label="Sobre el Parque"
        title="Casi 20 años de gestión hechos realidad"
        description="La historia del Parque Central de Santiago y su relación con la Asociación para el Desarrollo, Inc. (APEDI)."
        image="/images/galeria/entrada-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="story-hero">
            <img src="/images/galeria/entrada-parque.jpg" alt="Entrada del Parque Central de Santiago" />
          </div>

          <div className="story-timeline">
            {hitos.map((hito) => (
              <div className="story-hito" key={hito.titulo}>
                <span className="story-hito-fecha">{hito.fecha}</span>
                <h3>{hito.titulo}</h3>
                <p>{hito.texto}</p>
              </div>
            ))}
          </div>

          <div className="transparency-intro" style={{ marginTop: 28 }}>
            <div className="transparency-intro-icon">
              <i className="ti ti-handshake" />
            </div>
            <div>
              <h3>Relación con APEDI</h3>
              <p>
                El Parque Central de Santiago mantiene una estrecha relación con la Asociación
                para el Desarrollo, Inc. (APEDI), institución fundadora y actual presidenta del
                Patronato para la Administración del Parque Central de Santiago. El parque también
                trabaja de manera coordinada con diversas instituciones públicas, privadas,
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
