import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function Reserva() {
  return (
    <>
      <PageHero
        label="El Parque"
        title="Reserva"
        description="Calendario de actividades y reserva de espacios del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <div className="legal-card" style={{ maxWidth: 640, marginBottom: 24 }}>
            <h3>
              <i className="ti ti-calendar-event" /> Calendario de actividades
            </h3>
            <p>
              Todas las actividades programadas del Parque están disponibles en la sección de
              Actividades.
            </p>
            <Link to="/actividades" className="btn-outline" style={{ marginTop: 14 }}>
              Ver calendario de actividades <i className="ti ti-arrow-right" />
            </Link>
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
