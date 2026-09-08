import { PageHero } from '../components/PageHero'
import { LoadingState, ErrorState, EmptyState } from '../components/DataState'
import { useApiData } from '../hooks/useApiData'
import { api } from '../api/client'

/**
 * Programas y servicios del Parque.
 *
 * Esta página y la segunda mitad de Instalaciones mostraban lo mismo —los
 * mismos registros, traídos de la misma ruta— en dos estilos distintos: aquí
 * como tarjetas con ícono, allá como filas con foto. Quedó una sola, con el
 * estilo de las filas, que es el que deja ver la foto de cada programa.
 */

/**
 * Fotos de reserva para los programas que todavía no tienen la suya cargada
 * desde el panel. Se mantienen por nombre porque son las que el Parque nos pasó
 * al principio; en cuanto suban la suya, esta lista deja de usarse sola.
 */
const fotosPorNombre: Record<string, string> = {
  'Cibao Fútbol Club': '/images/galeria/cibao-futbol-club.jpg',
  'Escuela de Tenis – Washington Heights Tennis Association': '/images/galeria/cancha-tenis.jpg',
  Tirolesa: '/images/galeria/vista-aerea-parque.jpg',
  'Fun Stop – Carritos Corredores': '/images/galeria/funstop.jpg',
  'Alquiler de Bicicletas – Bicicentro': '/images/galeria/ciclistas.jpg',
}

export function ProgramasYServicios() {
  const { data, loading, error } = useApiData(api.getProgramas)

  return (
    <>
      <PageHero
        // La clave del encabezado no cambia aunque la página se llame de otra
        // manera: es la que une esta franja con su foto en el panel, y moverla
        // dejaría la sección sin imagen.
        pagina="programas-y-servicios"
        label="El Parque"
        title="Programas y Servicios"
        description="Las iniciativas y los servicios que el Parque Central de Santiago ofrece a la comunidad."
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
              description="Esta sección reunirá los programas y servicios del parque, en definición junto al equipo del Parque."
            />
          )}

          {data?.map((programa, i) => (
            <div className={`service-row ${i % 2 === 1 ? 'reverse' : ''}`} key={programa.id}>
              <div className="service-row-img">
                <img
                  src={
                    programa.fotoUrl ||
                    fotosPorNombre[programa.nombre] ||
                    '/images/galeria/entrada-parque.jpg'
                  }
                  alt={programa.nombre}
                  loading="lazy"
                />
              </div>
              <div className="service-row-text">
                <span className="tag">{programa.categoria}</span>
                <h3>{programa.nombre}</h3>
                <p>{programa.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
