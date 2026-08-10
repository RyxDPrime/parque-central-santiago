import { useState } from 'react'
import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api, type Publicacion } from '../api/client'

const fechaFormatter = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function Listado({
  publicaciones,
  icono,
  titulo,
  vacio,
  onAbrir,
}: {
  publicaciones: Publicacion[]
  icono: string
  titulo: string
  vacio: string
  onAbrir: (p: Publicacion) => void
}) {
  return (
    <div className="transparency-block">
      <h3>
        <i className={`ti ${icono}`} /> {titulo}
      </h3>

      {publicaciones.length === 0 ? (
        <EmptyState icon={icono} title="Próximamente" description={vacio} />
      ) : (
        <ul className="post-list">
          {publicaciones.map((p) => (
            <li key={p.id}>
              <button type="button" className="post-item" onClick={() => onAbrir(p)}>
                {p.imagenUrl && (
                  <span className="post-item-img">
                    <img src={p.imagenUrl} alt="" />
                  </span>
                )}
                <span className="post-item-body">
                  <span className="post-item-fecha">
                    {fechaFormatter.format(new Date(p.fecha))}
                  </span>
                  <span className="post-item-titulo">{p.titulo}</span>
                  {p.resumen && <span className="post-item-resumen">{p.resumen}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Blog() {
  const { data, loading, error } = useApiData(api.getPublicaciones)
  const [abierta, setAbierta] = useState<Publicacion | null>(null)

  const noticias = data?.filter((p) => p.tipo === 'noticia') ?? []
  const articulos = data?.filter((p) => p.tipo === 'articulo') ?? []

  return (
    <>
      <PageHero
        pagina="blog"
        label="Blog"
        title="Artículos y Noticias"
        description="Las publicaciones del Parque Central de Santiago."
        image="/images/galeria/dia-del-yoga.jpg"
        imagePosition="center 26%"
      />

      <section className="section">
        <div className="section-inner">
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {data && (
            <div className="transparency-grid">
              <Listado
                publicaciones={articulos}
                icono="ti-article"
                titulo="Artículos"
                vacio="Contenido informativo y educativo del parque, en preparación."
                onAbrir={setAbierta}
              />
              <Listado
                publicaciones={noticias}
                icono="ti-news"
                titulo="Noticias"
                vacio="Novedades y anuncios del parque, en preparación."
                onAbrir={setAbierta}
              />
            </div>
          )}
        </div>
      </section>

      {abierta && (
        <div className="lightbox" onClick={() => setAbierta(null)}>
          <button
            type="button"
            className="lightbox-close"
            aria-label="Cerrar"
            onClick={() => setAbierta(null)}
          >
            <i className="ti ti-x" />
          </button>
          <article className="post-detalle" onClick={(e) => e.stopPropagation()}>
            {abierta.imagenUrl && <img className="post-detalle-img" src={abierta.imagenUrl} alt="" />}
            <div className="post-detalle-cuerpo">
              <span className="post-item-fecha">
                {fechaFormatter.format(new Date(abierta.fecha))} ·{' '}
                {abierta.tipo === 'articulo' ? 'Artículo' : 'Noticia'}
              </span>
              <h2>{abierta.titulo}</h2>
              <p>{abierta.contenido}</p>
            </div>
          </article>
        </div>
      )}
    </>
  )
}
