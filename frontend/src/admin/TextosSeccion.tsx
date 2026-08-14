import { useParams } from 'react-router-dom'
import { TextosEditor } from './TextosEditor'
import { textoSecciones } from './entityConfigs'

/**
 * Pantalla de un grupo de textos que no pertenece a ninguna sección con tabla
 * (la portada, los títulos del inicio, los datos de contacto). Los grupos que
 * sí tienen sección se editan dentro de ella, no aquí.
 */
export function TextosSeccion() {
  const { seccion } = useParams<{ seccion: string }>()
  const config = textoSecciones.find((t) => t.slug === seccion)

  if (!config) return <p>Sección no encontrada.</p>

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className={`ti ${config.icon}`} />
        </div>
        <div>
          <h1>{config.label}</h1>
          <p>{config.description}</p>
        </div>
      </header>

      <TextosEditor grupos={[config.grupo]} embebido titulo={config.label} />
    </div>
  )
}
