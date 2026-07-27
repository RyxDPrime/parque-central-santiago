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
          <div className="card-grid">
            <EmptyState
              icon="ti-article"
              title="Artículos — próximamente"
              description="Contenido informativo y educativo del Parque, en preparación."
            />
            <EmptyState
              icon="ti-news"
              title="Noticias — próximamente"
              description="Novedades y anuncios del Parque, en preparación."
            />
          </div>
        </div>
      </section>
    </>
  )
}
