interface PageHeroProps {
  label: string
  title: string
  description: string
  /** Foto de fondo del parque; el texto se apoya sobre un degradado para mantener el contraste. */
  image?: string
}

export function PageHero({ label, title, description, image }: PageHeroProps) {
  return (
    <header className={`page-hero${image ? ' has-image' : ''}`}>
      {image && (
        <div className="page-hero-bg">
          <img src={image} alt="" aria-hidden="true" />
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
