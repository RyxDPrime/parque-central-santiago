import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { useTextos } from '../hooks/useTextos'
import { api } from '../api/client'

export function Reserva() {
  const { data: pasos } = useApiData(api.getPasosReserva)
  const texto = useTextos()

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
              <p>{texto('reserva.calendarioTexto')}</p>
              <Link to="/actividades" className="btn-outline-white" style={{ marginTop: 14 }}>
                Ver calendario de actividades <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>

          {pasos && pasos.length > 0 && (
            <>
              <h3
                style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--green-800)' }}
              >
                ¿Cómo reservar un espacio?
              </h3>
              <div className="steps-row">
                {pasos.map((paso, i) => (
                  <div className="step-card" key={paso.id}>
                    <span className="step-num">{i + 1}</span>
                    <i className={`ti ${paso.icono}`} />
                    <h3>{paso.titulo}</h3>
                    <p>{paso.texto}</p>
                  </div>
                ))}
              </div>
            </>
          )}

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
