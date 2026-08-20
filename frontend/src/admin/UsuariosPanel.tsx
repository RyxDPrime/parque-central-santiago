import { type FormEvent, useEffect, useState } from 'react'
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  getSesion,
  listUsuarios,
  type UsuarioPanel as Usuario,
} from './adminClient'
import { DESCRIPCION_ROL, NOMBRE_ROL, ROLES, type Rol } from './permisos'

const fecha = new Intl.DateTimeFormat('es-DO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

/**
 * Gestión de las personas con acceso al panel.
 *
 * Solo la ve quien tiene el permiso de usuarios. El servidor lo comprueba
 * igual en cada petición: esconder el enlace no basta.
 */
export function UsuariosPanel() {
  const yo = getSesion()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    listUsuarios()
      .then((d) => {
        setUsuarios(d)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar'))
      .finally(() => setCargando(false))
  }, [])

  function anunciar(texto: string) {
    setAviso(texto)
    setTimeout(() => setAviso((a) => (a === texto ? null : a)), 3500)
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formulario = event.currentTarget
    const datos = new FormData(formulario)
    setGuardando(true)
    setError(null)

    try {
      if (editando) {
        const clave = String(datos.get('password') ?? '')
        const actualizado = await actualizarUsuario(editando.id, {
          nombre: String(datos.get('nombre') ?? ''),
          email: String(datos.get('email') ?? ''),
          rol: String(datos.get('rol') ?? ''),
          // Solo se manda si escribieron una: en blanco significa "no la cambies".
          ...(clave ? { password: clave } : {}),
        })
        setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)))
        setEditando(null)
        anunciar(`Se guardaron los cambios de ${actualizado.nombre}.`)
      } else {
        const creado = await crearUsuario({
          nombre: String(datos.get('nombre') ?? ''),
          usuario: String(datos.get('usuario') ?? ''),
          email: String(datos.get('email') ?? '') || undefined,
          password: String(datos.get('password') ?? ''),
          rol: String(datos.get('rol') ?? 'editor'),
        })
        setUsuarios((prev) => [...prev, creado].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')))
        anunciar(`${creado.nombre} ya puede entrar al panel.`)
      }
      setVersion((v) => v + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  async function alternarActivo(u: Usuario) {
    const accion = u.activo ? 'dar de baja' : 'reactivar'
    if (!window.confirm(`¿Seguro que quieres ${accion} a ${u.nombre}?`)) return
    try {
      const actualizado = await actualizarUsuario(u.id, { activo: !u.activo })
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? actualizado : x)))
      anunciar(`${actualizado.nombre} quedó ${actualizado.activo ? 'activo' : 'dado de baja'}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar')
    }
  }

  async function borrar(u: Usuario) {
    if (!window.confirm(`¿Eliminar la cuenta de ${u.nombre}? Esto no se puede deshacer.`)) return
    try {
      await eliminarUsuario(u.id)
      setUsuarios((prev) => prev.filter((x) => x.id !== u.id))
      anunciar(`Se eliminó la cuenta de ${u.nombre}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar')
    }
  }

  const admins = usuarios.filter((u) => u.rol === 'admin' && u.activo).length

  return (
    <div className="admin-entity">
      <header className="admin-page-head">
        <div className="admin-page-icon">
          <i className="ti ti-users-group" />
        </div>
        <div>
          <h1>Usuarios del panel</h1>
          <p>
            Quiénes pueden entrar y qué puede hacer cada quien. Antes todo el equipo compartía una
            sola cuenta, así que no quedaba registro de quién cambiaba qué.
          </p>
        </div>
      </header>

      {aviso && (
        <p className="admin-warning is-ok">
          <i className="ti ti-check" /> {aviso}
        </p>
      )}
      {error && (
        <p className="form-feedback error" style={{ marginBottom: 20 }}>
          <i className="ti ti-alert-circle" /> {error}
        </p>
      )}

      <form className={`admin-form${editando ? ' is-editing' : ''}`} onSubmit={guardar} key={version}>
        <div className="admin-form-head">
          <span className="admin-form-badge">
            <i className={`ti ${editando ? 'ti-pencil' : 'ti-user-plus'}`} />
          </span>
          <div>
            <h2>{editando ? `Editar a ${editando.nombre}` : 'Agregar una persona'}</h2>
            <p>
              {editando
                ? 'El nombre de acceso no se cambia. Deja la contraseña en blanco para no tocarla.'
                : 'Cada persona entra con su propio usuario y contraseña.'}
            </p>
          </div>
          {editando && (
            <button type="button" className="admin-cancelar" onClick={() => setEditando(null)}>
              <i className="ti ti-x" /> Cancelar
            </button>
          )}
        </div>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="u-nombre">Nombre y apellido</label>
            <input
              id="u-nombre"
              name="nombre"
              type="text"
              required
              minLength={2}
              defaultValue={editando?.nombre ?? ''}
              placeholder="Ej: Laura Rodríguez"
            />
            <small className="admin-field-hint">Como aparece en la lista de abajo.</small>
          </div>

          {!editando && (
            <div className="admin-field">
              <label htmlFor="u-usuario">Usuario para entrar</label>
              <input
                id="u-usuario"
                name="usuario"
                type="text"
                required
                minLength={3}
                pattern="[a-zA-Z0-9._\-]+"
                placeholder="Ej: laura.rodriguez"
              />
              <small className="admin-field-hint">
                Sin espacios ni acentos. No se puede cambiar después.
              </small>
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="u-email">Correo (opcional)</label>
            <input
              id="u-email"
              name="email"
              type="email"
              defaultValue={editando?.email ?? ''}
              placeholder="Ej: laura@ejemplo.com"
            />
            <small className="admin-field-hint">Para saber a quién avisar, no para entrar.</small>
          </div>

          <div className="admin-field">
            <label htmlFor="u-password">
              {editando ? 'Contraseña nueva (opcional)' : 'Contraseña'}
            </label>
            <input
              id="u-password"
              name="password"
              type="text"
              required={!editando}
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
            <small className="admin-field-hint">
              {editando
                ? 'Solo si quieres restablecerla. En blanco, se queda la que tiene.'
                : 'Se la entregas a la persona; después puede cambiarla desde su sesión.'}
            </small>
          </div>

          <div className="admin-field admin-field-wide">
            <label htmlFor="u-rol">Rol</label>
            <select id="u-rol" name="rol" defaultValue={editando?.rol ?? 'editor'}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {NOMBRE_ROL[r]}
                </option>
              ))}
            </select>
            <div className="roles-ayuda">
              {ROLES.map((r) => (
                <p key={r}>
                  <strong>{NOMBRE_ROL[r]}:</strong> {DESCRIPCION_ROL[r as Rol]}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn-primary" disabled={guardando}>
            <i className="ti ti-device-floppy" />
            {guardando ? ' Guardando…' : editando ? ' Guardar cambios' : ' Crear usuario'}
          </button>
        </div>
      </form>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Personas con acceso</h2>
          <span className="admin-count">{usuarios.length}</span>
        </div>

        {cargando && <p className="admin-panel-msg">Cargando…</p>}

        {!cargando && usuarios.length > 0 && (
          <div className="admin-tabla-scroll">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const soyYo = yo?.id === u.id
                  // El último administrador activo no se puede tocar: dejar el
                  // panel sin nadie que gestione usuarios no tiene vuelta atrás.
                  const ultimoAdmin = u.rol === 'admin' && u.activo && admins <= 1
                  return (
                    <tr key={u.id} className={u.activo ? undefined : 'esta-inactivo'}>
                      <td>
                        {u.nombre}
                        {soyYo && <span className="admin-chip is-ok"> tú</span>}
                        {u.email && <div className="tabla-sub">{u.email}</div>}
                      </td>
                      <td>{u.usuario}</td>
                      <td>{NOMBRE_ROL[u.rol as Rol] ?? u.rol}</td>
                      <td>
                        {u.activo ? (
                          <span className="admin-chip is-ok">Activo</span>
                        ) : (
                          <span className="admin-chip is-warn">De baja</span>
                        )}
                      </td>
                      <td>{u.ultimoAcceso ? fecha.format(new Date(u.ultimoAcceso)) : 'Nunca'}</td>
                      <td className="admin-tabla-acciones">
                        <button type="button" title="Editar" onClick={() => setEditando(u)}>
                          <i className="ti ti-pencil" />
                        </button>
                        <button
                          type="button"
                          title={u.activo ? 'Dar de baja' : 'Reactivar'}
                          disabled={soyYo || ultimoAdmin}
                          onClick={() => alternarActivo(u)}
                        >
                          <i className={`ti ${u.activo ? 'ti-user-off' : 'ti-user-check'}`} />
                        </button>
                        <button
                          type="button"
                          title="Eliminar"
                          disabled={soyYo || ultimoAdmin}
                          onClick={() => borrar(u)}
                        >
                          <i className="ti ti-trash" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
