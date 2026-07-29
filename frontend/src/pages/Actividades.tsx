import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type Actividad as ActividadData } from '../api/client'

const monthLabelFormatter = new Intl.DateTimeFormat('es-DO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const dayFormatter = new Intl.DateTimeFormat('es-DO', { day: 'numeric', timeZone: 'UTC' })
const monthShortFormatter = new Intl.DateTimeFormat('es-DO', { month: 'short', timeZone: 'UTC' })
const rangeFormatter = new Intl.DateTimeFormat('es-DO', { day: 'numeric', month: 'long', timeZone: 'UTC' })

function formatRango(actividad: ActividadData): string {
  const inicio = rangeFormatter.format(new Date(actividad.fechaInicio))
  if (!actividad.fechaFin) return inicio
  const fin = rangeFormatter.format(new Date(actividad.fechaFin))
  return `${inicio} – ${fin}`
}

function groupByMonth(actividades: ActividadData[]) {
  const groups = new Map<string, ActividadData[]>()
  for (const actividad of actividades) {
    const date = new Date(actividad.fechaInicio)
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    const list = groups.get(key) ?? []
    list.push(actividad)
    groups.set(key, list)
  }
  return Array.from(groups.entries()).map(([key, items]) => ({
    label: monthLabelFormatter.format(new Date(items[0].fechaInicio)),
    key,
    items,
  }))
}

export function Actividades() {
  const { data, loading, error } = useApiData(api.getActividades)
  const groups = data ? groupByMonth(data) : []

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

          {groups.map((group) => (
            <div className="agenda-month" key={group.key}>
              <h2 className="agenda-month-title">{group.label}</h2>
              <div className="agenda-timeline">
                {group.items.map((actividad) => (
                  <div className="agenda-item" key={actividad.id}>
                    <div className="agenda-date-badge">
                      <span className="agenda-day">{dayFormatter.format(new Date(actividad.fechaInicio))}</span>
                      <span className="agenda-mon">{monthShortFormatter.format(new Date(actividad.fechaInicio))}</span>
                    </div>
                    <div className="agenda-content">
                      <span className="agenda-range">{formatRango(actividad)}</span>
                      <h3>{actividad.titulo}</h3>
                      {actividad.lugar && (
                        <p className="agenda-lugar">
                          <i className="ti ti-map-pin" /> {actividad.lugar}
                        </p>
                      )}
                      {actividad.descripcion && <p className="agenda-desc">{actividad.descripcion}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
