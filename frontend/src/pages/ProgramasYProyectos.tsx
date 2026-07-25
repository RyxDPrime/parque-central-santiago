import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function ProgramasYProyectos() {
  return (
    <>
      <PageHero
        label="El Parque"
        title="Programas y Proyectos"
        description="Las iniciativas y proyectos institucionales del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <EmptyState
            icon="ti-plant-2"
            title="Contenido en preparación"
            description="Esta sección reunirá las iniciativas y proyectos institucionales del parque, en definición junto al equipo del Parque. Mientras tanto, puedes conocer los servicios activos como el Cibao Fútbol Club, la Escuela de Tenis, la Tirolesa y Fun Stop en Instalaciones y Servicios."
          />
        </div>
      </section>
    </>
  )
}
