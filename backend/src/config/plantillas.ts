import { prisma } from "./db";
import { enviarCorreo } from "./correo";

/**
 * Los correos que el Parque escribe una vez y el sistema manda muchas.
 *
 * El texto vive en la base y no en el codigo porque es del Parque: cambiar como
 * se le habla a la gente no deberia requerir un despliegue.
 *
 * Un hueco se escribe {{asi}}. Los que no existan se borran en vez de dejarse a
 * la vista: es preferible una linea de menos que mandarle "{{espacio}}" a un
 * ciudadano porque alguien escribio mal el nombre del campo.
 *
 * Hay dos familias —reservas y aportes— y cada una tiene sus propios huecos.
 * La familia sale del prefijo de la clave, y por eso el panel nunca ofrece
 * {{espacio}} dentro de un correo de donacion: ahi no significaria nada.
 */

export const PLANTILLAS = {
  reservaAprobada: "reserva.aprobada",
  reservaRechazada: "reserva.rechazada",
  aporteRespuesta: "aporte.respuesta",
} as const;

export interface Hueco {
  clave: string;
  descripcion: string;
}

/** "reserva.aprobada" -> "reserva". */
export function familiaDe(clave: string): string {
  return clave.split(".")[0];
}

const HUECOS_RESERVA: Hueco[] = [
  { clave: "nombre", descripcion: "Nombre completo de quien solicita" },
  { clave: "primerNombre", descripcion: "Solo el primer nombre, para saludar" },
  { clave: "espacio", descripcion: "Espacio que pidio" },
  { clave: "tipoActividad", descripcion: "Tipo de actividad" },
  { clave: "fecha", descripcion: "Fecha en letras: lunes 14 de septiembre de 2026" },
  { clave: "horaInicio", descripcion: "Hora de entrada" },
  { clave: "horaFin", descripcion: "Hora de salida" },
  { clave: "personas", descripcion: "Cantidad de personas" },
  { clave: "requerimientos", descripcion: "Lo que pidio del Parque" },
  { clave: "descripcion", descripcion: "Lo que escribio sobre la actividad" },
  { clave: "institucion", descripcion: "Institucion o empresa, si puso alguna" },
  { clave: "cedula", descripcion: "Cedula" },
  { clave: "telefono", descripcion: "Telefono" },
  { clave: "motivo", descripcion: "Lo que se escribio al aprobar o rechazar" },
];

const HUECOS_APORTE: Hueco[] = [
  { clave: "nombre", descripcion: "Nombre completo de quien quiere aportar" },
  { clave: "primerNombre", descripcion: "Solo el primer nombre, para saludar" },
  { clave: "tipoAporte", descripcion: "Donacion, patrocinio o voluntariado" },
  { clave: "monto", descripcion: "Monto que planteo, ya con formato: RD$ 25,000" },
  { clave: "frecuencia", descripcion: "Una sola vez o mensual" },
  { clave: "institucion", descripcion: "Empresa o institucion, si puso alguna" },
  { clave: "telefono", descripcion: "Telefono" },
  { clave: "mensaje", descripcion: "Lo que escribio" },
  { clave: "respuesta", descripcion: "Lo que se le escriba al responder desde el panel" },
];

export const HUECOS_POR_FAMILIA: Record<string, Hueco[]> = {
  reserva: HUECOS_RESERVA,
  aporte: HUECOS_APORTE,
};

/** "2026-09-14" -> "lunes 14 de septiembre de 2026". */
export function fechaLarga(iso: string): string {
  const fecha = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? nombre;
}

export interface DatosSolicitud {
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
  motivo?: string | null;
}

export function valoresSolicitud(s: DatosSolicitud): Record<string, string> {
  return {
    nombre: s.nombre,
    primerNombre: primerNombre(s.nombre),
    espacio: s.espacio,
    tipoActividad: s.tipoActividad,
    fecha: fechaLarga(s.fecha),
    horaInicio: s.horaInicio,
    horaFin: s.horaFin,
    personas: String(s.personas),
    requerimientos: s.requerimientos || "",
    descripcion: s.descripcion,
    institucion: s.institucion ?? "",
    cedula: s.cedula,
    telefono: s.telefono,
    motivo: s.motivo ?? "",
  };
}

const ETIQUETA_APORTE: Record<string, string> = {
  dinero: "Donación en dinero",
  patrocinio: "Patrocinio institucional",
  voluntariado: "Voluntariado",
};

export interface DatosAporte {
  tipo: string;
  nombre: string;
  email: string;
  telefono: string;
  institucion: string | null;
  monto: number | null;
  frecuencia: string | null;
  mensaje: string;
  respuesta?: string | null;
}

export function valoresAporte(a: DatosAporte): Record<string, string> {
  return {
    nombre: a.nombre,
    primerNombre: primerNombre(a.nombre),
    tipoAporte: ETIQUETA_APORTE[a.tipo] ?? a.tipo,
    monto: a.monto ? `RD$ ${a.monto.toLocaleString("es-DO")}` : "",
    frecuencia: a.frecuencia ? (a.frecuencia === "mensual" ? "Mensual" : "Una sola vez") : "",
    institucion: a.institucion ?? "",
    telefono: a.telefono,
    mensaje: a.mensaje,
    respuesta: a.respuesta ?? "",
  };
}

/**
 * Rellena los huecos de un texto.
 *
 * Un hueco que queda vacio se lleva por delante las lineas en blanco que deja
 * detras: sin esto, un correo sin monto sale con un agujero de tres renglones
 * en medio.
 */
export function rellenar(texto: string, valores: Record<string, string>): string {
  return texto
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, clave: string) => valores[clave] ?? "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Manda un correo usando una plantilla guardada.
 *
 * Lanza si la plantilla no existe: preferimos que la bandeja muestre el fallo a
 * que algo quede decidido y la persona nunca se entere.
 */
export async function enviarPlantilla(
  clave: string,
  valores: Record<string, string>,
  para: { email: string; nombre: string },
): Promise<void> {
  const plantilla = await prisma.plantillaCorreo.findUnique({ where: { clave } });
  if (!plantilla) {
    throw new Error(`No existe la plantilla "${clave}"`);
  }

  await enviarCorreo({
    asunto: rellenar(plantilla.asunto, valores),
    texto: rellenar(plantilla.cuerpo, valores),
    para,
  });
}

/** Atajo para las dos decisiones de una solicitud de reserva. */
export async function enviarRespuestaSolicitud(
  clave: string,
  solicitud: DatosSolicitud & { email: string },
): Promise<void> {
  await enviarPlantilla(clave, valoresSolicitud(solicitud), {
    email: solicitud.email,
    nombre: solicitud.nombre,
  });
}
