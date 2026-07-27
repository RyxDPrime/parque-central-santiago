import { PageHero } from '../components/PageHero'

const normas = [
  'Respetar y cuidar las áreas verdes, jardines y demás espacios naturales del parque.',
  'Proteger la flora y la fauna, evitando dañar las plantas o molestar, alimentar o perseguir a los animales que habitan en el parque.',
  'Depositar la basura en los recipientes destinados para ello. Si observa algún residuo en el suelo, le invitamos a recogerlo y contribuir a mantener el parque limpio.',
  'Los propietarios de mascotas son responsables de recoger y disponer adecuadamente de los desechos de sus animales.',
  'Está prohibido el ingreso y consumo de bebidas alcohólicas, sustancias estupefacientes o cualquier otra sustancia ilícita.',
  'No se permite el ingreso de armas de fuego, armas blancas ni cualquier otro objeto que pueda poner en riesgo la seguridad de los visitantes.',
  'Queda prohibido encender fogatas, realizar quemas o cualquier actividad que represente riesgo de incendio.',
  'Los niños deberán permanecer en todo momento bajo la supervisión y responsabilidad de un adulto.',
  'Mantener una conducta de respeto hacia los demás visitantes, el personal del parque y las instalaciones.',
  'El uso de aparatos de sonido está permitido únicamente con un volumen moderado, procurando no afectar la tranquilidad y el disfrute de los demás usuarios.',
  'Toda persona deberá acatar las indicaciones del personal autorizado del parque, así como las disposiciones establecidas para la conservación del orden y la seguridad.',
  'El incumplimiento de estas normas podrá conllevar la suspensión de la permanencia en las instalaciones y la aplicación de las medidas correspondientes por parte de la administración del parque.',
]

export function Reglamento() {
  return (
    <>
      <PageHero
        label="Sobre Nosotros"
        title="Reglamento General"
        description="Normas de uso del Parque Central de Santiago, para preservar un ambiente seguro, limpio y agradable para todos los visitantes."
      />

      <section className="section">
        <div className="section-inner">
          <div className="legal-card" style={{ maxWidth: 760 }}>
            <h3>
              <i className="ti ti-clipboard-list" /> Normas generales
            </h3>
            <ol style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {normas.map((norma) => (
                <li key={norma} style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {norma}
                </li>
              ))}
            </ol>
          </div>

          <div className="empty-state" style={{ marginTop: 24 }}>
            <i className="ti ti-map-pin" />
            <h3>Reglamentos por área y por actividad</h3>
            <p>
              Las normas específicas para cada instalación (canchas, kioscos, senderos) y para
              actividades particulares se publicarán en cuanto el Parque las defina.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
