import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

const pasos = [
  {
    icon: 'ti-calendar-search',
    titulo: 'Consulta disponibilidad',
    texto: 'Revisa el calendario de actividades del parque para confirmar que la fecha que buscas esté libre.',
  },
  {
    icon: 'ti-message-2',
    titulo: 'Contáctanos',
    texto: 'Escríbenos por teléfono, WhatsApp o el formulario de contacto indicando fecha, espacio y tipo de actividad.',
  },
  {
    icon: 'ti-checkbox',
    titulo: 'Coordinación final',
    texto: 'El equipo del parque confirma la reserva y coordina contigo los detalles logísticos necesarios.',
  },
]

export function Reserva() {
  return (
    <>
      <PageHero
        label="El Parque"
        title="Reserva"
        description="Calendario de actividades y reserva de espacios del Parque Central de Santiago."
        image="/images/galeria/navidad-en-el-parque.jpg"
      />

      <section className="section">
        <div className="section-inner">
          <div className="transparency-intro">
            <div className="transparency-intro-icon">
              <i className="ti ti-calendar-event" />
            </div>
            <div>
              <h3>Calendario de actividades</h3>
              <p>
                Todas las actividades programadas del parque están disponibles en la sección de
                Actividades.
              </p>
              <Link to="/actividades" className="btn-outline" style={{ marginTop: 14 }}>
                Ver calendario de actividades <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--green-800)' }}>
            ¿Cómo reservar un espacio?
          </h3>
          <div className="steps-row">
            {pasos.map((paso, i) => (
              <div className="step-card" key={paso.titulo}>
                <span className="step-num">{i + 1}</span>
                <i className={`ti ${paso.icon}`} />
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </div>
            ))}
          </div>

          <EmptyState
            icon="ti-ticket"
            title="Reserva de espacios en línea — próximamente"
            description="Estamos trabajando en una funcionalidad para reservar kioscos y otros espacios del parque directamente desde el sitio, con opción de pago o aporte en línea. Mientras tanto, puedes coordinar una reserva escribiéndonos por Contacto."
          />
        </div>
      </section>
    </>
  )
}
