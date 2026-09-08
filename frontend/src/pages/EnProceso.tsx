import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'

/**
 * Plantilla para una sección que todavía no está lista.
 *
 * Existe para no tener que elegir entre dos malas opciones: publicar una página
 * a medias, o dejar un enlace del menú que lleva a un error. Aquí la persona
 * llega, entiende que esa sección está en preparación, y se va a otra parte del
 * sitio en vez de irse del sitio.
 *
 * Se usa como cualquier otra página, dándole el nombre de la sección:
 *
 *   <Route path="/blog" element={<EnProceso titulo="Blog" />} />
 *
 * Cuando la sección esté lista, se cambia esa línea por la página de verdad y
 * no queda nada que limpiar.
 */

interface Atajo {
  to: string
  /** Nombre del icono de Tabler, sin el prefijo. */
  icon: string
  label: string
}

/** A dónde mandar a quien llegó aquí. Son las secciones que sí están completas. */
const ATAJOS_POR_DEFECTO: Atajo[] = [
  { to: '/', icon: 'ti-home', label: 'Inicio' },
  { to: '/instalaciones', icon: 'ti-building', label: 'Instalaciones' },
  { to: '/actividades', icon: 'ti-calendar-event', label: 'Actividades' },
  { to: '/galeria', icon: 'ti-photo', label: 'Galería' },
]

interface EnProcesoProps {
  /** El nombre de la sección, tal como aparece en el menú. */
  titulo: string
  /**
   * Qué va a haber aquí cuando esté. Decirlo cambia la espera: una página que
   * anuncia lo que viene invita a volver; una que solo dice "en construcción",
   * no.
   */
  descripcion?: string
  /** Clave del encabezado en el panel, para que la foto se pueda cambiar sin tocar código. */
  pagina?: string
  /** Foto de la franja superior mientras el panel no tenga una. */
  image?: string
  /** Encuadre por defecto de esa foto. */
  imagePosition?: string
  /** Para cambiar a dónde se invita a ir. Sin esto, van las secciones completas. */
  atajos?: Atajo[]
}

export function EnProceso({
  titulo,
  descripcion = 'Estamos preparando el contenido de esta sección.',
  pagina,
  image = '/images/galeria/vista-aerea-parque.jpg',
  imagePosition,
  atajos = ATAJOS_POR_DEFECTO,
}: EnProcesoProps) {
  return (
    <>
      <PageHero
        pagina={pagina}
        label="En proceso"
        title={titulo}
        description={descripcion}
        image={image}
        imagePosition={imagePosition}
      />

      <section className="section">
        <div className="section-inner">
          <div className="enproceso">
            {/* Un brote y no un cono de obra: el Parque no está en obras, esta
                sección está creciendo. */}
            <i className="ti ti-seeding enproceso-icono" aria-hidden="true" />

            <span className="enproceso-sello">En preparación</span>

            <h2>Esta sección estará disponible pronto</h2>
            <p>
              El equipo del Parque está reuniendo la información de <strong>{titulo}</strong>.
              Queremos publicarla completa y verificada, así que preferimos tomarnos unos días
              más antes de ponerla en línea.
            </p>

            <div className="enproceso-atajos">
              {atajos.map((atajo) => (
                <Link to={atajo.to} key={atajo.to} className="enproceso-atajo">
                  <i className={`ti ${atajo.icon}`} aria-hidden="true" />
                  {atajo.label}
                </Link>
              ))}
            </div>

            <p className="enproceso-pie">
              ¿Buscabas algo puntual de esta sección?{' '}
              <Link to="/contacto">Escríbenos</Link> y te respondemos directamente.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
