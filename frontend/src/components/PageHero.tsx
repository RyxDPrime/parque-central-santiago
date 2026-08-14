import { useEncabezado } from '../hooks/useEncabezado'

interface PageHeroProps {
  label: string
  title: string
  description: string
  /** Clave del encabezado en el panel, para tomar la foto desde la base. */
  pagina?: string
  /** Foto por defecto, si el panel todavía no tiene una para esta página. */
  image?: string
  /** Encuadre por defecto (CSS object-position). */
  imagePosition?: string
}

export function PageHero({
  label,
  title,
  description,
  pagina,
  image,
  imagePosition,
}: PageHeroProps) {
  const guardado = useEncabezado(pagina)

  // Manda lo que el panel tenga guardado; si esa clave no existe todavía, la
  // foto por defecto. Si existe y quedó vacía, la franja va sin foto a
  // propósito y se ve solo el degradado verde.
  const foto = guardado.configurado ? guardado.imagen : image
  const encuadre = guardado.configurado ? guardado.posicion : imagePosition

  return (
    <header className={`page-hero${foto ? ' has-image' : ''}`}>
      {foto && (
        <div className="page-hero-bg">
          <img
            src={foto}
            alt=""
            aria-hidden="true"
            style={encuadre ? { objectPosition: encuadre } : undefined}
          />
        </div>
      )}
      <div className="page-hero-inner">
        <div className="page-hero-label">{label}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  )
}
