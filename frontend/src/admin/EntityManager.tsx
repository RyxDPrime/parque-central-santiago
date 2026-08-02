import { type FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createEntity, deleteEntity, listEntity, updateEntity, uploadFile } from './adminClient'
import { entityConfigs, type FieldConfig } from './entityConfigs'
import { FileDropzone } from './FileDropzone'

type Row = Record<string, unknown> & { id: number }

function coerceValue(field: FieldConfig, raw: FormDataEntryValue | null): unknown {
  if (field.type === 'number') {
    if (raw === null || raw === '') {
      // Se omite el campo (en vez de mandar null) para que la base de datos
      // aplique su valor por defecto — varios campos numéricos como "orden"
      // no aceptan null aunque sean opcionales en el formulario.
      return field.required ? 0 : undefined
    }
    return Number(raw)
  }
  if (raw === null || raw === '') return null
  return raw
}

// Los campos largos ocupan el ancho completo para que no queden apretados.
function isWideField(field: FieldConfig) {
  return field.type === 'textarea' || field.type === 'file'
}

export function EntityManager() {
  const { entity } = useParams<{ entity: string }>()
  const config = entityConfigs.find((e) => e.path === entity)

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Row | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!config) return
    setLoading(true)
    listEntity<Row>(config.path)
      .then((data) => {
        setRows(data)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [config?.path])

  if (!config) {
    return <p>Sección no encontrada.</p>
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!config) return
    setSaving(true)
    setFormError(null)
    const formElement = event.currentTarget
    try {
      const form = new FormData(formElement)
      const data: Record<string, unknown> = {}

      for (const field of config.fields) {
        if (field.type === 'file') {
          const file = form.get(field.key) as File | null
          if (file && file.size > 0) {
            data[field.key] = await uploadFile(file)
          } else if (editing) {
            data[field.key] = editing[field.key] ?? null
          }
        } else {
          data[field.key] = coerceValue(field, form.get(field.key))
        }
      }

      if (editing) {
        const updated = await updateEntity<Row>(config.path, editing.id, data)
        setRows((prev) => prev.map((r) => (r.id === editing.id ? updated : r)))
        setEditing(null)
      } else {
        const created = await createEntity<Row>(config.path, data)
        setRows((prev) => [...prev, created])
      }
      formElement.reset()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!config) return
    if (!window.confirm('¿Eliminar este registro?')) return
    try {
      await deleteEntity(config.path, id)
      setRows((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const visibleFields = config.fields.filter((f) => editing || f.showOnCreate !== false)

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

      <form
        className={`admin-form${editing ? ' is-editing' : ''}`}
        onSubmit={handleSubmit}
        key={editing?.id ?? 'new'}
      >
        <div className="admin-form-head">
          <span className="admin-form-badge">
            <i className={`ti ${editing ? 'ti-pencil' : 'ti-plus'}`} />
          </span>
          <div>
            <h2>{editing ? 'Editando registro' : 'Agregar nuevo'}</h2>
            <p>
              {editing
                ? String(editing[config.titleField] ?? 'Sin título')
                : 'Completa los campos y guarda para publicarlo en el sitio.'}
            </p>
          </div>
        </div>

        <div className="admin-form-grid">
          {visibleFields.map((field) => (
            <div
              className={`admin-field${isWideField(field) ? ' is-wide' : ''}`}
              key={field.key}
            >
              <label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="admin-field-req">obligatorio</span>}
              </label>

              {field.type === 'textarea' && (
                <textarea
                  id={field.key}
                  name={field.key}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={(editing?.[field.key] as string) ?? ''}
                />
              )}

              {field.type === 'select' && (
                <select
                  id={field.key}
                  name={field.key}
                  defaultValue={(editing?.[field.key] as string) ?? field.options?.[0]?.value}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'file' && (
                <FileDropzone
                  name={field.key}
                  accept={field.accept}
                  required={field.required}
                  currentFileLabel={
                    editing && editing[field.key] ? String(editing[field.key]).split('/').pop() : null
                  }
                />
              )}

              {(field.type === 'text' || field.type === 'number' || field.type === 'date') && (
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={
                    field.type === 'date'
                      ? String(editing?.[field.key] ?? '').slice(0, 10)
                      : ((editing?.[field.key] as string | number) ?? '')
                  }
                />
              )}
            </div>
          ))}
        </div>

        {formError && (
          <p className="form-feedback error">
            <i className="ti ti-alert-circle" /> {formError}
          </p>
        )}

        <div className="admin-form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            <i className={`ti ${editing ? 'ti-device-floppy' : 'ti-plus'}`} />
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editing && (
            <button type="button" className="btn-outline" onClick={() => setEditing(null)}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Registros publicados</h2>
          <span className="admin-count">{rows.length}</span>
        </div>

        {loading && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <div className="admin-empty">
            <i className={`ti ${config.icon}`} />
            <h3>Todavía no hay registros</h3>
            <p>Usa el formulario de arriba para agregar el primero.</p>
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {config.fields.map((f) => (
                    <th key={f.key}>{f.label}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {config.fields.map((f) => (
                      <td key={f.key}>
                        {f.type === 'file' ? (
                          row[f.key] ? (
                            <span className="admin-chip is-ok">
                              <i className="ti ti-check" /> Cargado
                            </span>
                          ) : (
                            <span className="admin-chip">Sin archivo</span>
                          )
                        ) : (
                          String(row[f.key] ?? '—')
                        )}
                      </td>
                    ))}
                    <td className="admin-table-actions">
                      <button type="button" title="Editar" onClick={() => setEditing(row)}>
                        <i className="ti ti-edit" />
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        className="is-danger"
                        onClick={() => handleDelete(row.id)}
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
