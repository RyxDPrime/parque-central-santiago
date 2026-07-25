interface EmptyStateProps {
  icon: string
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <i className={`ti ${icon}`} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function LoadingState({ label = 'Cargando información…' }: { label?: string }) {
  return <p className="status-msg">{label}</p>
}

export function ErrorState({ message }: { message: string }) {
  return <p className="status-msg is-error">No se pudo cargar la información: {message}</p>
}
