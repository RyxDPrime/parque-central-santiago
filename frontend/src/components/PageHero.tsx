interface PageHeroProps {
  label: string
  title: string
  description: string
}

export function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <header className="page-hero">
      <div className="page-hero-inner">
        <div className="page-hero-label">{label}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  )
}
