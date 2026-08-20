/**
 * Qué puede hacer cada rol.
 *
 * Es la única fuente: el backend decide con esto qué peticiones acepta, y el
 * panel decide con la misma lista qué secciones muestra. Si se separan, el
 * panel enseña botones que el servidor va a rechazar.
 *
 * Ocultar una opción en pantalla no protege nada: quien conozca la dirección
 * puede llamarla igual. Por eso cada ruta que escribe comprueba el permiso.
 */

export const ROLES = ["admin", "editor", "comunicaciones"] as const;
export type Rol = (typeof ROLES)[number];

export const PERMISOS = [
  /** Secciones de contenido del sitio: historia, instalaciones, textos, fotos. */
  "contenido",
  /** Lo que se publica y se responde a diario: blog, galería, actividades, buzones. */
  "comunicaciones",
  /** Crear personas, cambiarles el rol y darles de baja. */
  "usuarios",
] as const;
export type Permiso = (typeof PERMISOS)[number];

const PERMISOS_POR_ROL: Record<Rol, readonly Permiso[]> = {
  admin: ["contenido", "comunicaciones", "usuarios"],
  editor: ["contenido", "comunicaciones"],
  comunicaciones: ["comunicaciones"],
};

/** Nombre del rol tal como se muestra en el panel. */
export const NOMBRE_ROL: Record<Rol, string> = {
  admin: "Administrador",
  editor: "Editor",
  comunicaciones: "Comunicaciones",
};

export function esRol(valor: unknown): valor is Rol {
  return typeof valor === "string" && (ROLES as readonly string[]).includes(valor);
}

export function permisosDe(rol: string): readonly Permiso[] {
  return esRol(rol) ? PERMISOS_POR_ROL[rol] : [];
}

export function puede(rol: string, permiso: Permiso): boolean {
  return permisosDe(rol).includes(permiso);
}
