import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function MisionYVision() {
  return (
    <>
      <PageHero
        label="Sobre el Parque"
        title="Misión y Visión"
        description="Los lineamientos institucionales del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <EmptyState
            icon="ti-target"
            title="En definición interna"
            description="La misión y la visión están siendo definidas internamente por el Parque. Esta sección se publicará en cuanto el equipo confirme el texto definitivo."
          />
        </div>
      </section>
    </>
  )
}
