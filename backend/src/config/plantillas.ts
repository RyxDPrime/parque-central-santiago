import { prisma } from "./db";
import { enviarCorreo } from "./correo";

/**
 * Los correos de respuesta a una solicitud de reserva.
 *
 * El texto lo escribe el Parque desde el panel; aqui solo se rellenan los
 * huecos con los datos de la solicitud que se esta decidiendo y se manda.
 *
 * Un hueco se escribe {{asi}}. Los que no existan se borran en vez de dejarse
 * a la vista: es preferible una linea de menos que mandarle "{{espacio}}" a un
 * ciudadano porque alguien escribio mal el nombre del campo.
 */

/** Claves de plantilla que el sistema usa. No se crean ni se borran. */
export const PLANTILLAS = {
  aprobada: "reserva.aprobada",
  rechazada: "reserva.rechazada",
} as const;

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

/** "2026-09-14" -> "lunes 14 de septiembre de 2026". */
function fechaLarga(iso: string): string {
  const fecha = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleDateString("es-DO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Los huecos que se pueden usar en una plantilla. Esta lista es tambien la que
 * se le muestra a quien edita el texto en el panel, asi que sale de un solo
 * lugar: si se agrega uno aqui, aparece alli sin tocar nada mas.
 */
export const HUECOS: { clave: string; descripcion: string }[] = [
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

function valores(s: DatosSolicitud): Record<string, string> {
  return {
    nombre: s.nombre,
    primerNombre: s.nombre.trim().split(/\s+/)[0] ?? s.nombre,
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

/**
 * Rellena los huecos de un texto.
 *
 * Si un hueco queda vacio y ocupaba la linea entera, la linea se va: dejarla
 * produce un correo con "Motivo:" y nada detras, que se lee como un error.
 */
export function rellenar(texto: string, s: DatosSolicitud): string {
  const datos = valores(s);
  const relleno = texto.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, clave: string) => datos[clave] ?? "");

  return relleno
    .split("\n")
    // Una linea que quedo vacia pero en el original tenia algo mas que el hueco
    // (por ejemplo "Motivo: {{motivo}}") sigue teniendo el "Motivo:", asi que
    // esto solo limpia el exceso de lineas en blanco que deja un hueco solo.
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Manda la respuesta a quien solicito, usando la plantilla que corresponda.
 *
 * Lanza si la plantilla no existe: preferimos que la bandeja muestre el fallo a
 * que la solicitud quede decidida y la persona nunca se entere.
 */
export async function enviarRespuestaSolicitud(
  clave: string,
  solicitud: DatosSolicitud,
): Promise<void> {
  const plantilla = await prisma.plantillaCorreo.findUnique({ where: { clave } });
  if (!plantilla) {
    throw new Error(`No existe la plantilla "${clave}"`);
  }

  await enviarCorreo({
    asunto: rellenar(plantilla.asunto, solicitud),
    texto: rellenar(plantilla.cuerpo, solicitud),
    para: { email: solicitud.email, nombre: solicitud.nombre },
  });
}
