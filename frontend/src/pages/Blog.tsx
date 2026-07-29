import { PageHero } from '../components/PageHero'
import { EmptyState } from '../components/DataState'

export function Blog() {
  return (
    <>
      <PageHero
        label="Blog"
        title="Artículos y Noticias"
        description="Las publicaciones del Parque Central de Santiago."
      />

      <section className="section">
        <div className="section-inner">
          <div className="transparency-grid">
            <div className="transparency-block">
              <h3>
                <i className="ti ti-article" /> Artículos
              </h3>
              <EmptyState
                icon="ti-article"
                title="Próximamente"
                description="Contenido informativo y educativo del parque, en preparación."
              />
            </div>
            <div className="transparency-block">
              <h3>
                <i className="ti ti-news" /> Noticias
              </h3>
              <EmptyState
                icon="ti-news"
                title="Próximamente"
                description="Novedades y anuncios del parque, en preparación."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
