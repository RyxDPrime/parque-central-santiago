import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

const normas = [
  { icon: 'ti-tree', titulo: 'Cuida las áreas verdes', texto: 'Respeta y cuida las áreas verdes, jardines y demás espacios naturales del parque.' },
  { icon: 'ti-feather', titulo: 'Protege la flora y fauna', texto: 'Evita dañar las plantas o molestar, alimentar o perseguir a los animales que habitan en el parque.' },
  { icon: 'ti-trash', titulo: 'Mantén el parque limpio', texto: 'Deposita la basura en los recipientes destinados para ello, o recógela si la encuentras en el suelo.' },
  { icon: 'ti-paw', titulo: 'Responsabilidad con mascotas', texto: 'Los propietarios de mascotas son responsables de recoger y disponer adecuadamente de sus desechos.' },
  { icon: 'ti-ban', titulo: 'Sin alcohol ni sustancias ilícitas', texto: 'Está prohibido el ingreso y consumo de bebidas alcohólicas, sustancias estupefacientes o cualquier otra sustancia ilícita.' },
  { icon: 'ti-shield-x', titulo: 'Sin armas', texto: 'No se permite el ingreso de armas de fuego, armas blancas ni ningún objeto que ponga en riesgo la seguridad de los visitantes.' },
  { icon: 'ti-flame-off', titulo: 'Sin fogatas', texto: 'Queda prohibido encender fogatas, realizar quemas o cualquier actividad que represente riesgo de incendio.' },
  { icon: 'ti-users', titulo: 'Niños supervisados', texto: 'Los niños deberán permanecer en todo momento bajo la supervisión y responsabilidad de un adulto.' },
  { icon: 'ti-heart-handshake', titulo: 'Convivencia respetuosa', texto: 'Mantén una conducta de respeto hacia los demás visitantes, el personal del parque y las instalaciones.' },
  { icon: 'ti-volume', titulo: 'Volumen moderado', texto: 'El uso de aparatos de sonido está permitido únicamente con un volumen moderado, sin afectar a los demás usuarios.' },
  { icon: 'ti-info-circle', titulo: 'Sigue las indicaciones', texto: 'Toda persona deberá acatar las indicaciones del personal autorizado y las disposiciones de orden y seguridad.' },
  { icon: 'ti-alert-triangle', titulo: 'Incumplimiento de normas', texto: 'Podrá conllevar la suspensión de la permanencia en las instalaciones y las medidas correspondientes.' },
]

export function Reglamento() {
  return (
    <>
      <PageHero
        label="Sobre Nosotros"
        title="Reglamento General"
        description="Normas de uso del Parque Central de Santiago, para preservar un ambiente seguro, limpio y agradable para todos los visitantes."
        image="/images/galeria/vista-aerea-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="facility-icon-grid">
            {normas.map((norma) => (
              <div className="facility-icon-card" key={norma.titulo}>
                <div className="facility-icon-badge">
                  <i className={`ti ${norma.icon}`} />
                </div>
                <div>
                  <div className="facility-icon-head">
                    <h3>{norma.titulo}</h3>
                  </div>
                  <p>{norma.texto}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <EmptyState
              icon="ti-map-pin"
              title="Reglamentos por área y por actividad"
              description="Las normas específicas para cada instalación (canchas, kioscos, senderos) y para actividades particulares se publicarán en cuanto el Parque las defina."
            />
          </div>
        </div>
      </section>
    </>
  )
}
