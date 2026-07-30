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

  return (
    <div className="admin-entity">
      <h1>{config.label}</h1>

      <form className="admin-form" onSubmit={handleSubmit} key={editing?.id ?? 'new'}>
        <h2>{editing ? `Editar: ${String(editing[config.titleField])}` : 'Agregar nuevo'}</h2>
        <div className="admin-form-grid">
          {config.fields.map((field) => (
            <div className="form-row" key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
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

        {formError && <p className="form-feedback error">{formError}</p>}

        <div className="admin-form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editing && (
            <button type="button" className="btn-outline" onClick={() => setEditing(null)}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {loading && <p className="status-msg">Cargando…</p>}
      {error && <p className="status-msg is-error">{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              {config.fields.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {config.fields.map((f) => (
                  <td key={f.key}>
                    {f.type === 'file'
                      ? row[f.key]
                        ? '✓'
                        : '—'
                      : String(row[f.key] ?? '—')}
                  </td>
                ))}
                <td className="admin-table-actions">
                  <button type="button" onClick={() => setEditing(row)}>
                    <i className="ti ti-edit" />
                  </button>
                  <button type="button" onClick={() => handleDelete(row.id)}>
                    <i className="ti ti-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
