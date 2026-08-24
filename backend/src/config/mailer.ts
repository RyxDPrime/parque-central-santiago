import { enviarCorreo } from "./correo";

/**
 * Los dos correos que el sitio envia al Parque: el del formulario de contacto y
 * el de sugerencias. Aqui solo se arma el texto; de mandarlo se encarga
 * `correo.ts`, que es el unico que sabe por donde sale.
 */

interface ContactMailInput {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

export async function sendContactNotification(input: ContactMailInput): Promise<void> {
  const lineas = [
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    input.telefono ? `Telefono: ${input.telefono}` : null,
    input.asunto ? `Asunto: ${input.asunto}` : null,
    "",
    input.mensaje,
  ].filter((linea): linea is string => linea !== null);

  await enviarCorreo({
    asunto: `Nuevo mensaje de contacto - ${input.asunto || "Sitio web Parque Central"}`,
    texto: lineas.join("\n"),
    // Responder le escribe al visitante, no al propio Parque.
    responderA: { email: input.email, nombre: input.nombre },
  });
}

const ETIQUETA_TIPO: Record<string, string> = {
  sugerencia: "Sugerencia",
  felicitacion: "Felicitacion",
  queja: "Queja",
  otro: "Comunicacion",
};

interface SugerenciaMailInput {
  tipo: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}

export async function sendSugerenciaNotification(input: SugerenciaMailInput): Promise<void> {
  const etiqueta = ETIQUETA_TIPO[input.tipo] ?? "Comunicacion";
  const lineas = [
    `Tipo: ${etiqueta}`,
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    input.telefono ? `Telefono: ${input.telefono}` : null,
    "",
    input.mensaje,
  ].filter((linea): linea is string => linea !== null);

  await enviarCorreo({
    asunto: `${etiqueta} desde el sitio web - ${input.nombre}`,
    texto: lineas.join("\n"),
    responderA: { email: input.email, nombre: input.nombre },
  });
}

// ── SOLICITUDES DE RESERVA ──

interface SolicitudMailInput {
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

function resumen(s: SolicitudMailInput): string[] {
  return [
    `Espacio: ${s.espacio}`,
    `Actividad: ${s.tipoActividad}`,
    `Fecha: ${fechaLarga(s.fecha)}`,
    `Horario: ${s.horaInicio} a ${s.horaFin}`,
    `Personas: ${s.personas}`,
    s.requerimientos ? `Requiere: ${s.requerimientos}` : null,
  ].filter((linea): linea is string => linea !== null);
}

/** Aviso al Parque de que entró una solicitud nueva. */
export async function sendSolicitudReservaNotification(s: SolicitudMailInput): Promise<void> {
  const lineas = [
    "Entro una solicitud de reserva por el sitio web.",
    "",
    "QUIEN LA PIDE",
    `Nombre: ${s.nombre}`,
    `Cedula: ${s.cedula}`,
    `Email: ${s.email}`,
    `Telefono: ${s.telefono}`,
    s.institucion ? `Institucion: ${s.institucion}` : null,
    "",
    "QUE PIDE",
    ...resumen(s),
    "",
    "DESCRIPCION DE LA ACTIVIDAD",
    s.descripcion,
    "",
    "Queda pendiente en el panel del sitio hasta que alguien la apruebe o la rechace.",
  ].filter((linea): linea is string => linea !== null);

  await enviarCorreo({
    asunto: `Solicitud de reserva - ${s.espacio}, ${fechaLarga(s.fecha)}`,
    texto: lineas.join("\n"),
    // Responder le escribe a quien la pidio, que es lo que se va a querer hacer.
    responderA: { email: s.email, nombre: s.nombre },
  });
}

/**
 * Acuse al solicitante. Existe por una razon concreta: sin el, alguien llena el
 * formulario un martes y se presenta el domingo convencido de que el kiosco es
 * suyo. Dice con todas sus letras que todavia no hay nada reservado.
 */
export async function sendAcuseSolicitud(s: SolicitudMailInput): Promise<void> {
  const lineas = [
    `Hola ${s.nombre.split(" ")[0]},`,
    "",
    "Recibimos tu solicitud de reserva en el Parque Central de Santiago.",
    "",
    "ESTO ES LO QUE PEDISTE",
    ...resumen(s),
    "",
    "TODAVIA NO ES UNA RESERVA",
    "El equipo del Parque tiene que revisarla y aprobarla. Te vamos a escribir a",
    "este mismo correo con la respuesta. Hasta entonces el espacio no esta",
    "apartado a tu nombre.",
    "",
    "Si necesitas hablar con alguien: 809-583-9581, o por WhatsApp al 849-580-7344.",
    "",
    "Parque Central de Santiago",
  ];

  await enviarCorreo({
    asunto: "Recibimos tu solicitud de reserva - Parque Central de Santiago",
    texto: lineas.join("\n"),
    para: { email: s.email, nombre: s.nombre },
  });
}

// ── APORTES Y DONACIONES ──

interface AporteMailInput {
  tipo: string;
  nombre: string;
  email: string;
  telefono: string;
  institucion?: string;
  monto?: number;
  frecuencia?: string;
  mensaje: string;
}

const ETIQUETA_APORTE: Record<string, string> = {
  dinero: "Donacion en dinero",
  patrocinio: "Patrocinio institucional",
  voluntariado: "Voluntariado",
};

/** "25000" -> "RD$ 25,000". */
export function pesos(monto: number): string {
  return `RD$ ${monto.toLocaleString("es-DO")}`;
}

function detalleAporte(a: AporteMailInput): string[] {
  return [
    `Tipo: ${ETIQUETA_APORTE[a.tipo] ?? a.tipo}`,
    `Nombre: ${a.nombre}`,
    `Email: ${a.email}`,
    `Telefono: ${a.telefono}`,
    a.institucion ? `Institucion: ${a.institucion}` : null,
    a.monto ? `Monto que plantea: ${pesos(a.monto)}` : null,
    a.frecuencia ? `Frecuencia: ${a.frecuencia === "mensual" ? "Mensual" : "Una sola vez"}` : null,
  ].filter((linea): linea is string => linea !== null);
}

/** Aviso al Parque de que alguien quiere aportar. */
export async function sendAporteNotification(a: AporteMailInput): Promise<void> {
  const etiqueta = ETIQUETA_APORTE[a.tipo] ?? "Aporte";
  const lineas = [
    "Alguien quiere aportar al Parque, desde la pagina de Donaciones.",
    "",
    ...detalleAporte(a),
    "",
    "LO QUE ESCRIBIO",
    a.mensaje,
    "",
    "Nadie ha pagado nada: esto es una intencion de aportar. Hay que contactar",
    "a la persona para coordinarlo. Queda en la bandeja del panel.",
  ];

  await enviarCorreo({
    asunto: `${etiqueta} - ${a.nombre}${a.institucion ? ` (${a.institucion})` : ""}`,
    texto: lineas.join("\n"),
    responderA: { email: a.email, nombre: a.nombre },
  });
}

/**
 * Acuse a quien quiere aportar.
 *
 * Dice dos cosas que evitan malentendidos: que no se le cobro nada, y que
 * alguien del Parque le va a escribir. Sin lo primero, alguien puede creer que
 * ya dono; sin lo segundo, que su mensaje se perdio.
 */
export async function sendAcuseAporte(a: AporteMailInput): Promise<void> {
  const lineas = [
    `Hola ${a.nombre.trim().split(/\s+/)[0]},`,
    "",
    "Gracias por querer aportar al Parque Central de Santiago. Recibimos tu",
    "mensaje y alguien del equipo te va a escribir para coordinarlo.",
    "",
    "ESTO ES LO QUE NOS DIJISTE",
    ...detalleAporte(a).slice(0, 1),
    a.monto ? `Monto que planteas: ${pesos(a.monto)}` : "",
    "",
    "NO SE TE HA COBRADO NADA",
    "El sitio no cobra. Cualquier aporte se coordina directamente contigo, y",
    "eres tu quien decide como y cuando hacerlo.",
    "",
    "Si prefieres hablar con alguien: 809-583-9581, o por WhatsApp al",
    "849-580-7344.",
    "",
    "Parque Central de Santiago",
  ].filter((linea) => linea !== "");

  await enviarCorreo({
    asunto: "Recibimos tu mensaje - Parque Central de Santiago",
    texto: lineas.join("\n"),
    para: { email: a.email, nombre: a.nombre },
  });
}
