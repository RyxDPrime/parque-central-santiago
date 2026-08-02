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
  bio: string | null;
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
  enviarContacto: (data: ContactoInput) => post<{ ok: boolean }>("/contacto", data),
};
