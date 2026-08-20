/**
 * Los mismos roles y permisos que aplica el servidor.
 *
 * Aquí solo se usan para decidir qué se muestra. Quien lo necesite de verdad es
 * el backend, que rechaza cualquier petición sin permiso: ocultar una opción no
 * protege nada, solo evita ofrecerle a alguien un botón que le va a fallar.
 */

export const ROLES = ['admin', 'editor', 'comunicaciones'] as const
export type Rol = (typeof ROLES)[number]

export type Permiso = 'contenido' | 'comunicaciones' | 'usuarios'

export const NOMBRE_ROL: Record<Rol, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  comunicaciones: 'Comunicaciones',
}

export const DESCRIPCION_ROL: Record<Rol, string> = {
  admin: 'Todo el sitio, y además crea y da de baja a las demás personas.',
  editor: 'Todo el contenido del sitio y los buzones. No gestiona usuarios.',
  comunicaciones: 'Blog, galería, actividades y los buzones de mensajes.',
}

/** Secciones del panel que exigen el permiso de comunicaciones. */
export const SECCIONES_COMUNICACIONES = new Set([
  'publicaciones',
  'galeria',
  'actividades',
  'mensajes',
  'sugerencias',
])

/** Qué permiso hace falta para una sección del panel. */
export function permisoDeSeccion(ruta: string): Permiso {
  if (ruta === 'usuarios') return 'usuarios'
  return SECCIONES_COMUNICACIONES.has(ruta) ? 'comunicaciones' : 'contenido'
}
