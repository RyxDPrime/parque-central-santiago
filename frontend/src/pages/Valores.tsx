import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function Valores() {
  return (
    <>
      <PageHero
        label="Sobre Nosotros"
        title="Valores"
        description="Los valores institucionales del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <EmptyState
            icon="ti-heart"
            title="En definición interna"
            description="Los valores están siendo definidos internamente por el Parque, junto con la misión y la visión. Esta sección se publicará en cuanto el equipo confirme el texto definitivo."
          />
        </div>
      </section>
    </>
  )
}
