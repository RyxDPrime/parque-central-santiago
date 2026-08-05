import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

function iconFor(categoria: string) {
  const c = categoria.toLowerCase()
  if (c.includes('fútbol') || c.includes('futbol')) return 'ti-ball-football'
  if (c.includes('tenis')) return 'ti-tournament'
  if (c.includes('aventura')) return 'ti-mountain'
  if (c.includes('bicicleta')) return 'ti-bike'
  if (c.includes('infantil') || c.includes('recreación') || c.includes('recreacion')) return 'ti-car'
  return 'ti-plant-2'
}

export function ProgramasYProyectos() {
  const { data, loading, error } = useApiData(api.getProgramas)

  return (
    <>
      <PageHero
        label="El Parque"
        title="Programas y Proyectos"
        description="Las iniciativas y proyectos institucionales del Parque Central de Santiago."
        image="/images/galeria/cibao-futbol-club.jpg"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && data.length === 0 && (
            <EmptyState
              icon="ti-plant-2"
              title="Contenido en preparación"
              description="Esta sección reunirá las iniciativas y proyectos institucionales del parque, en definición junto al equipo del Parque."
            />
          )}

          {data && data.length > 0 && (
            <div className="program-card-grid">
              {data.map((programa) => (
                <div className="program-card" key={programa.id}>
                  <div className="program-card-icon">
                    <i className={`ti ${iconFor(programa.categoria)}`} />
                  </div>
                  <span className="program-card-cat">{programa.categoria}</span>
                  <h3>{programa.nombre}</h3>
                  <p>{programa.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
