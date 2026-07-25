import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type Actividad as ActividadData } from '../api/client'

const dateFormatter = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatFecha(actividad: ActividadData): string {
  const inicio = dateFormatter.format(new Date(actividad.fechaInicio))
  if (!actividad.fechaFin) return inicio
  const fin = dateFormatter.format(new Date(actividad.fechaFin))
  return `${inicio} – ${fin}`
}

export function Actividades() {
  const { data, loading, error } = useApiData(api.getActividades)

  return (
    <>
      <PageHero
        label="El Parque"
        title="Actividades"
        description="La agenda de eventos y actividades del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && data.length === 0 && (
            <EmptyState
              icon="ti-calendar-event"
              title="Agenda en preparación"
              description="El calendario de actividades 2026 se publicará próximamente. Síguenos en redes sociales para no perderte los próximos eventos."
            />
          )}

          {data && data.length > 0 && (
            <div className="card-grid">
              {data.map((actividad) => (
                <div key={actividad.id} className="info-card">
                  <span className="tag">{formatFecha(actividad)}</span>
                  <h3 style={{ marginBottom: 8 }}>{actividad.titulo}</h3>
                  {actividad.lugar && (
                    <p style={{ marginBottom: 6 }}>
                      <i className="ti ti-map-pin" /> {actividad.lugar}
                    </p>
                  )}
                  {actividad.descripcion && <p>{actividad.descripcion}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
