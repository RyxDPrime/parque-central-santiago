import { aAbsoluta, aRelativa, convertirMedios } from "../api/medios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "pcs_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("pcs_admin_sesion");
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

async function parseErrorMessage(res: Response): Promise<string> {
  const payload = await res.json().catch(() => null);
  return payload?.error ?? `Error (${res.status})`;
}

export interface Sesion {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
  permisos: string[];
}

const SESION_KEY = "pcs_admin_sesion";

export function getSesion(): Sesion | null {
  const guardada = localStorage.getItem(SESION_KEY);
  if (!guardada) return null;
  try {
    return JSON.parse(guardada) as Sesion;
  } catch {
    return null;
  }
}

function setSesion(sesion: Sesion): void {
  localStorage.setItem(SESION_KEY, JSON.stringify(sesion));
}

export async function login(username: string, password: string): Promise<Sesion> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  const data = (await res.json()) as { token: string; usuario: Sesion };
  setToken(data.token);
  setSesion(data.usuario);
  return data.usuario;
}

/**
 * Vuelve a preguntarle al servidor quien soy.
 *
 * Lo guardado en el navegador puede haber quedado viejo: si a alguien le
 * cambian el rol o le dan de baja, el panel debe enterarse sin esperar a que
 * cierre sesion.
 */
export async function refrescarSesion(): Promise<Sesion | null> {
  const res = await fetch(`${API_URL}/admin/yo`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  const sesion = (await res.json()) as Sesion;
  setSesion(sesion);
  return sesion;
}

export function puede(permiso: string): boolean {
  return getSesion()?.permisos?.includes(permiso) ?? false;
}

export async function cambiarClave(actual: string, nueva: string): Promise<void> {
  const res = await fetch(`${API_URL}/admin/cambiar-clave`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ actual, nueva }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export interface UsuarioPanel {
  id: number;
  nombre: string;
  usuario: string;
  email: string | null;
  rol: string;
  activo: boolean;
  ultimoAcceso: string | null;
  createdAt: string;
}

export async function listUsuarios(): Promise<UsuarioPanel[]> {
  const res = await fetch(`${API_URL}/usuarios`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<UsuarioPanel[]>;
}

export async function crearUsuario(datos: {
  nombre: string;
  usuario: string;
  email?: string;
  password: string;
  rol: string;
}): Promise<UsuarioPanel> {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<UsuarioPanel>;
}

export async function actualizarUsuario(
  id: number,
  datos: Partial<{ nombre: string; email: string; rol: string; activo: boolean; password: string }>,
): Promise<UsuarioPanel> {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<UsuarioPanel>;
}

export async function eliminarUsuario(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function listEntity<T>(entityPath: string): Promise<T[]> {
  // Se manda la sesion aunque casi todas estas rutas sean publicas: alguna
  // —como el listado de espacios que incluye los dados de baja— solo existe
  // para el panel y responde 401 sin ella. Las publicas la ignoran.
  const token = getToken();
  const res = await fetch(`${API_URL}/${entityPath}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return convertirMedios(await res.json(), aAbsoluta) as T[];
}

export async function createEntity<T>(entityPath: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/${entityPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    // Al guardar se le quita el dominio: en la base las rutas viven relativas,
    // para que cambiar de servidor no rompa las fotos ya cargadas.
    body: JSON.stringify(convertirMedios(data, aRelativa)),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return convertirMedios(await res.json(), aAbsoluta) as T;
}

export async function updateEntity<T>(entityPath: string, id: number, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/${entityPath}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(convertirMedios(data, aRelativa)),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return convertirMedios(await res.json(), aAbsoluta) as T;
}

export async function deleteEntity(entityPath: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${entityPath}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export interface ContactMessage {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  asunto: string | null;
  mensaje: string;
  emailEnviado: boolean;
  createdAt: string;
}

export async function listMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_URL}/mensajes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<ContactMessage[]>;
}

export async function deleteMessage(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/mensajes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = (await res.json()) as { url: string };
  // Se devuelve tal cual, relativa: quien la muestre le pondrá el dominio del
  // backend, y lo que se guarda en la base queda independiente del servidor.
  return data.url;
}

export interface Sugerencia {
  id: number;
  tipo: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  leida: boolean;
  emailEnviado: boolean;
  createdAt: string;
}

export async function listSugerencias(): Promise<Sugerencia[]> {
  const res = await fetch(`${API_URL}/sugerencias`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<Sugerencia[]>;
}

/** Marca o desmarca como leida. Es lo unico editable de una sugerencia. */
export async function marcarSugerenciaLeida(id: number, leida: boolean): Promise<Sugerencia> {
  const res = await fetch(`${API_URL}/sugerencias/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ leida }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<Sugerencia>;
}

export async function deleteSugerencia(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/sugerencias/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

// ── SOLICITUDES DE RESERVA ──

export interface SolicitudReserva {
  id: number;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  institucion: string | null;
  espacio: string;
  tipoActividad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  personas: number;
  requerimientos: string;
  descripcion: string;
  estado: string;
  motivo: string | null;
  notaInterna: string | null;
  emailEnviado: boolean;
  /** Si al decidirla se le pudo escribir a quien la pidio. */
  respuestaEnviada: boolean;
  respuestaError: string | null;
  createdAt: string;
}

export async function listSolicitudes(): Promise<SolicitudReserva[]> {
  const res = await fetch(`${API_URL}/solicitudes-reserva`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<SolicitudReserva[]>;
}

/**
 * Aprobar, rechazar o cancelar.
 *
 * Aprobar y rechazar le escriben a quien solicito con la plantilla guardada; el
 * motivo entra en ese correo. Con `avisar` en false se decide sin mandar nada,
 * para cuando ya se hablo con la persona por telefono.
 */
export async function cambiarEstadoSolicitud(
  id: number,
  estado: string,
  motivo?: string,
  avisar = true,
): Promise<SolicitudReserva> {
  const res = await fetch(`${API_URL}/solicitudes-reserva/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ estado, motivo, avisar }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<SolicitudReserva>;
}

export async function eliminarSolicitud(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/solicitudes-reserva/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

// ── PLANTILLAS DE RESPUESTA ──

export interface PlantillaCorreo {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  asunto: string;
  cuerpo: string;
  orden: number;
  updatedAt: string;
}

/** Un hueco que se puede escribir en la plantilla, como {{espacio}}. */
export interface HuecoPlantilla {
  clave: string;
  descripcion: string;
}

export async function listPlantillas(): Promise<PlantillaCorreo[]> {
  const res = await fetch(`${API_URL}/plantillas-correo`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<PlantillaCorreo[]>;
}

/**
 * Los huecos los dice el servidor, para que la ayuda del panel no se quede
 * vieja. Vienen agrupados por familia —reserva, aporte— porque {{espacio}} no
 * significa nada dentro de un correo de donacion.
 */
export async function listHuecos(): Promise<Record<string, HuecoPlantilla[]>> {
  const res = await fetch(`${API_URL}/plantillas-huecos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<Record<string, HuecoPlantilla[]>>;
}

export async function guardarPlantilla(
  id: number,
  datos: { asunto: string; cuerpo: string },
): Promise<PlantillaCorreo> {
  const res = await fetch(`${API_URL}/plantillas-correo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<PlantillaCorreo>;
}

// ── APORTES (DONACIONES) ──

export interface Aporte {
  id: number;
  tipo: string;
  nombre: string;
  email: string;
  telefono: string;
  institucion: string | null;
  monto: number | null;
  frecuencia: string | null;
  mensaje: string;
  // Origen de los fondos, cuando el aporte supero el umbral
  donanteTipo: string | null;
  documento: string | null;
  origenFondos: string | null;
  esPep: boolean;
  declaraLicito: boolean;
  // La decision y su constancia
  estado: string;
  motivoRechazo: string | null;
  decididaPor: string | null;
  decididaEn: string | null;
  notaInterna: string | null;
  emailEnviado: boolean;
  respuestaEnviada: boolean;
  respuestaError: string | null;
  createdAt: string;
}

export async function listAportes(): Promise<Aporte[]> {
  const res = await fetch(`${API_URL}/aportes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<Aporte[]>;
}

export interface MotivoRechazo {
  id: number;
  nombre: string;
  nota: string | null;
  activo: boolean;
  orden: number;
}

/** Los motivos por los que se puede rechazar. No son publicos. */
export async function listMotivosRechazo(): Promise<MotivoRechazo[]> {
  const res = await fetch(`${API_URL}/motivos-rechazo`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<MotivoRechazo[]>;
}

/**
 * Aceptar o rechazar un aporte.
 *
 * `motivoRechazo` es obligatorio al rechazar, sale de la lista y es INTERNO:
 * nunca viaja en el correo. Lo que la persona lee es `respuesta`.
 */
export async function decidirAporte(
  id: number,
  datos: {
    estado: string;
    motivoRechazo?: string;
    respuesta?: string;
    notaInterna?: string;
    avisar?: boolean;
  },
): Promise<Aporte> {
  const res = await fetch(`${API_URL}/aportes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json() as Promise<Aporte>;
}

export async function eliminarAporte(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/aportes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}
