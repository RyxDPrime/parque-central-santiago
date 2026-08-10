const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface JuntaDirectivoMember {
  id: number;
  institucion: string;
  representante: string;
  cargo: string;
  logoUrl: string | null;
  fotoUrl: string | null;
  orden: number;
}

export interface Instalacion {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number | null;
  orden: number;
}

export interface Programa {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
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
  /** "valor:Etiqueta,valor:Etiqueta" — si viene, se edita con una lista. */
  opciones: string | null;
  orden: number;
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
  return res.json() as Promise<T>;
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
  getPasosReserva: () => get<PasoReserva[]>("/pasos-reserva"),
  getFormasApoyo: () => get<FormaApoyo[]>("/formas-apoyo"),
  getCifras: () => get<Cifra[]>("/cifras"),
  getTextos: () => get<Texto[]>("/textos"),
  enviarContacto: (data: ContactoInput) => post<{ ok: boolean }>("/contacto", data),
};
