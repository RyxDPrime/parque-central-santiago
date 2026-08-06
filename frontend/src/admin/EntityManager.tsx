import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createEntity, deleteEntity, listEntity, updateEntity, uploadFile } from './adminClient'
import { entityConfigs, type FieldConfig } from './entityConfigs'
import { FileDropzone } from './FileDropzone'

type Row = Record<string, unknown> & { id: number }

function coerceValue(field: FieldConfig, raw: FormDataEntryValue | null): unknown {
  // Las casillas sin marcar no aparecen en el formulario, así que su ausencia
  // es justamente el "false".
  if (field.type === 'checkbox') {
    return raw !== null
  }
  // El input de fecha entrega "2026-08-06" y la base de datos exige fecha y
  // hora completas. Se fija a medianoche UTC, que es la zona con la que se
  // muestran las fechas en todo el sitio, para que no se corra un día.
  if (field.type === 'date') {
    if (raw === null || raw === '') return null
    return `${String(raw)}T00:00:00.000Z`
  }
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
  return field.type === 'textarea' || field.type === 'file' || field.type === 'checkbox'
}

function textoDe(valor: unknown): string {
  return valor === null || valor === undefined ? '' : String(valor)
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
  // Cambiarlo remonta el formulario, que es lo único que limpia de verdad los
  // campos de archivo (reset() no borra la vista previa ni el nombre elegido).
  const [formVersion, setFormVersion] = useState(0)

  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState<Record<string, string>>({})
  const [ordenCampo, setOrdenCampo] = useState<string>('')
  const [ordenDir, setOrdenDir] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (!config) return
    setLoading(true)
    setBusqueda('')
    setFiltros({})
    setOrdenCampo('')
    listEntity<Row>(config.path)
      .then((data) => {
        setRows(data)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [config?.path])

  // Los campos de tipo lista sirven como filtros (ej. auditado / sin auditar).
  const camposFiltrables = useMemo(
    () => config?.fields.filter((f) => f.type === 'select') ?? [],
    [config],
  )

  const filasVisibles = useMemo(() => {
    if (!config) return []
    let resultado = rows

    const q = busqueda.trim().toLowerCase()
    if (q) {
      resultado = resultado.filter((row) =>
        config.fields
          .filter((f) => f.type !== 'file')
          .some((f) => textoDe(row[f.key]).toLowerCase().includes(q)),
      )
    }

    for (const [clave, valor] of Object.entries(filtros)) {
      if (!valor) continue
      resultado = resultado.filter((row) => textoDe(row[clave]) === valor)
    }

    if (ordenCampo) {
      const campo = config.fields.find((f) => f.key === ordenCampo)
      resultado = [...resultado].sort((a, b) => {
        const va = a[ordenCampo]
        const vb = b[ordenCampo]
        let cmp: number
        if (campo?.type === 'number') {
          cmp = Number(va ?? 0) - Number(vb ?? 0)
        } else if (campo?.type === 'date') {
          cmp = new Date(textoDe(va)).getTime() - new Date(textoDe(vb)).getTime()
        } else {
          cmp = textoDe(va).localeCompare(textoDe(vb), 'es', { sensitivity: 'base' })
        }
        return ordenDir === 'asc' ? cmp : -cmp
      })
    }

    return resultado
  }, [config, rows, busqueda, filtros, ordenCampo, ordenDir])

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
        await updateEntity<Row>(config.path, editing.id, data)
        setEditing(null)
      } else {
        await createEntity<Row>(config.path, data)
      }
      // Se recarga en vez de parchear la fila: al insertar o mover, el backend
      // renumera las demás posiciones y esos valores quedarían viejos aquí.
      setRows(await listEntity<Row>(config.path))
      setFormVersion((v) => v + 1)
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
      // Igual que al guardar: borrar cierra el hueco y renumera el resto.
      setRows(await listEntity<Row>(config.path))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  const visibleFields = config.fields.filter((f) => editing || f.showOnCreate !== false)
  const hayFiltrosActivos = Boolean(busqueda.trim()) || Object.values(filtros).some(Boolean)

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
        // La cantidad entra en la clave porque la posición propuesta depende de
        // ella, y los valores por defecto solo se aplican al montar: sin esto el
        // campo se queda con el valor calculado antes de que lleguen los datos.
        key={`${editing?.id ?? 'new'}-${formVersion}-${rows.length}`}
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
            <div className={`admin-field${isWideField(field) ? ' is-wide' : ''}`} key={field.key}>
              {field.type !== 'checkbox' && (
                <label htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="admin-field-req">obligatorio</span>}
                </label>
              )}

              {field.type === 'checkbox' && (
                <label className="admin-check" htmlFor={field.key}>
                  <input
                    id={field.key}
                    name={field.key}
                    type="checkbox"
                    defaultChecked={Boolean(editing?.[field.key])}
                  />
                  <span>{field.label}</span>
                </label>
              )}

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
                  currentFileUrl={editing ? ((editing[field.key] as string) ?? null) : null}
                />
              )}

              {(field.type === 'text' || field.type === 'number' || field.type === 'date') && (
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  min={field.nextPosition ? 1 : undefined}
                  max={field.nextPosition ? (editing ? rows.length : rows.length + 1) : undefined}
                  step={field.nextPosition ? 1 : undefined}
                  defaultValue={
                    field.type === 'date'
                      ? String(editing?.[field.key] ?? '').slice(0, 10)
                      : field.nextPosition && !editing
                        ? // Se propone la última posición: lo habitual al agregar
                          // es que el registro nuevo vaya al final.
                          rows.length + 1
                        : ((editing?.[field.key] as string | number) ?? '')
                  }
                />
              )}
              {field.hint && <small className="admin-field-hint">{field.hint}</small>}

              {field.nextPosition && (
                <small className="admin-field-hint">
                  {editing
                    ? `Del 1 al ${rows.length}. Al cambiarla, los demás se renumeran solos.`
                    : `Se agregará en la posición ${rows.length + 1}. Si eliges una menor, los siguientes bajan un puesto.`}
                </small>
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
          <span className="admin-count">
            {hayFiltrosActivos ? `${filasVisibles.length} de ${rows.length}` : rows.length}
          </span>
        </div>

        {!loading && !error && rows.length > 0 && (
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="ti ti-search" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar en ${config.label.toLowerCase()}…`}
                aria-label="Buscar"
              />
            </div>

            {camposFiltrables.map((campo) => (
              <label className="admin-toolbar-campo" key={campo.key}>
                <span>{campo.label}</span>
                <select
                  value={filtros[campo.key] ?? ''}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, [campo.key]: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  {campo.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <label className="admin-toolbar-campo">
              <span>Ordenar por</span>
              <select value={ordenCampo} onChange={(e) => setOrdenCampo(e.target.value)}>
                <option value="">Sin ordenar</option>
                {config.fields
                  .filter((f) => f.type !== 'file')
                  .map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
              </select>
            </label>

            <button
              type="button"
              className="admin-orden-dir"
              onClick={() => setOrdenDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              disabled={!ordenCampo}
              title={ordenDir === 'asc' ? 'Ascendente' : 'Descendente'}
            >
              <i className={`ti ${ordenDir === 'asc' ? 'ti-sort-ascending' : 'ti-sort-descending'}`} />
            </button>

            {hayFiltrosActivos && (
              <button
                type="button"
                className="admin-limpiar"
                onClick={() => {
                  setBusqueda('')
                  setFiltros({})
                }}
              >
                <i className="ti ti-x" /> Limpiar
              </button>
            )}
          </div>
        )}

        {loading && <p className="admin-panel-msg">Cargando…</p>}
        {error && <p className="admin-panel-msg is-error">{error}</p>}

        {!loading && !error && rows.length === 0 && (
          <div className="admin-empty">
            <i className={`ti ${config.icon}`} />
            <h3>Todavía no hay registros</h3>
            <p>Usa el formulario de arriba para agregar el primero.</p>
          </div>
        )}

        {!loading && !error && rows.length > 0 && filasVisibles.length === 0 && (
          <div className="admin-empty">
            <i className="ti ti-search-off" />
            <h3>Ningún registro coincide</h3>
            <p>Prueba con otra búsqueda o quita los filtros.</p>
          </div>
        )}

        {!loading && !error && filasVisibles.length > 0 && (
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
                {filasVisibles.map((row) => (
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
                        ) : f.type === 'checkbox' ? (
                          row[f.key] ? (
                            <span className="admin-chip is-ok">
                              <i className="ti ti-check" /> Sí
                            </span>
                          ) : (
                            <span className="admin-chip">No</span>
                          )
                        ) : f.type === 'date' ? (
                          row[f.key] ? String(row[f.key]).slice(0, 10) : '—'
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
