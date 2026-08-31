import { aAbsoluta, convertirMedios } from "./medios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface JuntaDirectivoMember {
  id: number;
  institucion: string;
  /** Vacios mientras la institucion no haya designado a nadie. */
  representante: string | null;
  cargo: string | null;
  logoUrl: string | null;
  fotoUrl: string | null;
  orden: number;
}

export interface Instalacion {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  fotoUrl: string | null;
  orden: number;
}

export interface Programa {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  fotoUrl: string | null;
  orden: number;
}

export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  lugar: string | null;
  imagenUrl: string | null;
}

export interface GaleriaItem {
  id: number;
  titulo: string | null;
  url: string;
  tipo: string;
  categoria: string | null;
  orden: number;
}

export interface PersonalTecnico {
  id: number;
  nombre: string;
  cargo: string;
  fotoUrl: string | null;
  orden: number;
}

export interface DocumentoFinanciero {
  id: number;
  titulo: string;
  tipo: string;
  url: string;
  fecha: string | null;
  orden: number;
}

export interface Publicacion {
  id: number;
  titulo: string;
  tipo: string;
  resumen: string | null;
  contenido: string;
  imagenUrl: string | null;
  fecha: string;
  destacada: boolean;
}

export interface PuntoMapa {
  id: number;
  nombre: string;
  zona: string | null;
  /** Coordenadas geográficas del punto. */
  lat: number;
  lng: number;
  fotoUrl: string | null;
  orden: number;
}

export interface Hito {
  id: number;
  fecha: string;
  titulo: string;
  texto: string;
  orden: number;
}

export interface Valor {
  id: number;
  icono: string;
  titulo: string;
  texto: string;
  orden: number;
}

export interface Norma {
  id: number;
  icono: string;
  titulo: string;
  texto: string;
  orden: number;
}

export interface PasoReserva {
  id: number;
  icono: string;
  titulo: string;
  texto: string;
  orden: number;
}

export interface FormaApoyo {
  id: number;
  icono: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  orden: number;
}

export interface Cifra {
  id: number;
  numero: string;
  descripcion: string;
  imagenUrl: string | null;
  etiqueta: string | null;
  enlaceTexto: string | null;
  enlaceUrl: string | null;
  orden: number;
}

export interface Texto {
  id: number;
  clave: string;
  etiqueta: string;
  grupo: string;
  valor: string;
  multiline: boolean;
  /** Descripción breve de qué cambia este texto en el sitio. */
  ayuda: string | null;
  /** "valor:Etiqueta,valor:Etiqueta" — si viene, se edita con una lista. */
  opciones: string | null;
  orden: number;
}

export interface Aliado {
  id: number;
  nombre: string;
  logoUrl: string | null;
  sitioWeb: string | null;
  orden: number;
}

export interface EncabezadoPagina {
  id: number;
  clave: string;
  etiqueta: string;
  imagenUrl: string;
  posicion: string;
  orden: number;
}

export type TipoSugerencia = "sugerencia" | "felicitacion" | "queja" | "otro";

export interface SugerenciaInput {
  tipo: TipoSugerencia;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export interface Sugerencia extends SugerenciaInput {
  id: number;
  leida: boolean;
  emailEnviado: boolean;
  createdAt: string;
}

export interface EspacioReservable {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  capacidad: number | null;
  requierePago: boolean;
  activo: boolean;
  orden: number;
}

export interface TipoActividad {
  id: number;
  nombre: string;
  permitido: boolean;
  nota: string | null;
  orden: number;
}

/** Lo ya apartado. Sin datos de quién reservó: eso es asunto del Parque. */
export interface ReservaOcupada {
  id: number;
  espacio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface SolicitudReservaInput {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  institucion?: string;
  espacio: string;
  tipoActividad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  personas: number;
  requerimientos: string;
  descripcion: string;
  acepta: true;
}

export interface CuentaBancaria {
  id: number;
  banco: string;
  tipoCuenta: string;
  numero: string;
  titular: string;
  rnc: string | null;
  moneda: string;
  nota: string | null;
  activa: boolean;
  orden: number;
}

export interface OrigenFondos {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export type TipoAporte = 'dinero' | 'patrocinio' | 'voluntariado';

export interface AporteInput {
  tipo: TipoAporte;
  nombre: string;
  email: string;
  telefono: string;
  institucion?: string;
  monto?: number;
  frecuencia?: 'unica' | 'mensual';
  mensaje: string;
  /** Origen de los fondos. Solo va cuando el aporte supera el umbral. */
  donanteTipo?: 'persona' | 'empresa';
  documento?: string;
  origenFondos?: string;
  esPep?: boolean;
  declaraLicito?: boolean;
}

export interface ContactoInput {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`No se pudo cargar la información (${res.status})`);
  }
  // Las rutas de archivos vienen relativas desde la base; aquí se les pone el
  // dominio del backend para que el navegador pueda pedirlas.
  return convertirMedios(await res.json(), aAbsoluta) as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error ?? `No se pudo enviar la solicitud (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getJuntaDirectiva: () => get<JuntaDirectivoMember[]>("/junta-directiva"),
  getInstalaciones: () => get<Instalacion[]>("/instalaciones"),
  getProgramas: () => get<Programa[]>("/programas"),
  getActividades: () => get<Actividad[]>("/actividades"),
  getGaleria: () => get<GaleriaItem[]>("/galeria"),
  getPersonalTecnico: () => get<PersonalTecnico[]>("/personal-tecnico"),
  getDocumentosFinancieros: () => get<DocumentoFinanciero[]>("/documentos-financieros"),
  getPublicaciones: () => get<Publicacion[]>("/publicaciones"),
  getPuntosMapa: () => get<PuntoMapa[]>("/puntos-mapa"),
  getHitos: () => get<Hito[]>("/hitos"),
  getNormas: () => get<Norma[]>("/normas"),
  getValores: () => get<Valor[]>("/valores"),
  getPasosReserva: () => get<PasoReserva[]>("/pasos-reserva"),
  getFormasApoyo: () => get<FormaApoyo[]>("/formas-apoyo"),
  getCifras: () => get<Cifra[]>("/cifras"),
  getTextos: () => get<Texto[]>("/textos"),
  getEncabezados: () => get<EncabezadoPagina[]>("/encabezados"),
  getAliados: () => get<Aliado[]>("/aliados"),
  getEspaciosReservables: () => get<EspacioReservable[]>("/espacios-reservables"),
  getTiposActividad: () => get<TipoActividad[]>("/tipos-actividad"),
  getReservasOcupadas: () => get<ReservaOcupada[]>("/reservas-ocupadas"),
  enviarSolicitudReserva: (data: SolicitudReservaInput) =>
    post<{ ok: boolean; id: number }>("/solicitudes-reserva", data),
  getCuentasBancarias: () => get<CuentaBancaria[]>("/cuentas-bancarias"),
  getOrigenesFondos: () => get<OrigenFondos[]>("/origenes-fondos"),
  enviarAporte: (data: AporteInput) => post<{ ok: boolean; id: number }>("/aportes", data),
  enviarContacto: (data: ContactoInput) => post<{ ok: boolean }>("/contacto", data),
  enviarSugerencia: (data: SugerenciaInput) => post<{ ok: boolean }>("/sugerencias", data),
};
