/**
 * Calendarios en formato iCalendar (.ics).
 *
 * Es el formato estándar que entienden Google Calendar, Outlook y el calendario
 * del iPhone. Se usa para dos cosas distintas:
 *
 *   - Un archivo suelto con una sola actividad, que se le manda a quien pidió
 *     la reserva cuando se le aprueba. Lo abre, lo guarda y ya la tiene.
 *   - Una suscripción con todas las reservas aprobadas, para que el equipo del
 *     Parque las vea en su propio calendario, en el teléfono, junto a sus demás
 *     compromisos. Se suscribe una vez y se actualiza solo.
 *
 * No hace falta ninguna API externa ni cuenta de terceros: el archivo se arma
 * aquí, con los datos que ya están en la base.
 */

export interface EventoCalendario {
  /** Identificador estable: si el mismo evento se vuelve a bajar, se actualiza en vez de duplicarse. */
  id: string;
  titulo: string;
  /** "2026-09-14" */
  fecha: string;
  /** "09:00" */
  horaInicio: string;
  horaFin: string;
  descripcion?: string;
  lugar?: string;
}

/**
 * Escapa lo que el formato trata como sintaxis: la coma, el punto y coma, la
 * barra invertida y el salto de línea. Sin esto, una descripción con una coma
 * parte el campo en dos y el archivo deja de abrirse.
 */
function escapar(texto: string): string {
  return texto
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** "2026-09-14" + "09:00" -> "20260914T090000". Hora local, sin zona. */
function marca(fecha: string, hora: string): string {
  return `${fecha.replace(/-/g, "")}T${hora.replace(":", "")}00`;
}

function ahoraUtc(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * El formato exige que ninguna línea pase de 75 octetos, y que las
 * continuaciones empiecen con un espacio. Un título largo sin plegar hace que
 * algunos calendarios descarten el evento entero sin decir por qué.
 */
function plegar(linea: string): string {
  if (Buffer.byteLength(linea, "utf8") <= 73) return linea;
  const trozos: string[] = [];
  let actual = "";
  for (const caracter of linea) {
    if (Buffer.byteLength(actual + caracter, "utf8") > 73) {
      trozos.push(actual);
      actual = " ";
    }
    actual += caracter;
  }
  trozos.push(actual);
  return trozos.join("\r\n");
}

/**
 * Arma el archivo.
 *
 * La zona horaria va declarada como America/Santo_Domingo: sin ella, un
 * calendario en otra zona corre las horas y la reserva de las 9 de la mañana
 * aparece a las 5.
 */
export function construirIcs(nombre: string, eventos: EventoCalendario[]): string {
  const lineas: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Parque Central de Santiago//Reservas//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapar(nombre)}`,
    "X-WR-TIMEZONE:America/Santo_Domingo",
    // La zona declarada entera. El estandar exige definir toda zona que se
    // nombre en un evento; Google y el iPhone perdonan que falte, pero algunas
    // versiones de Outlook descartan el evento sin avisar. Republica Dominicana
    // no cambia de hora en verano, asi que basta un unico tramo a UTC-4.
    "BEGIN:VTIMEZONE",
    "TZID:America/Santo_Domingo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0400",
    "TZNAME:AST",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  for (const e of eventos) {
    lineas.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@parquecentralsantiagord.com`,
      `DTSTAMP:${ahoraUtc()}`,
      `DTSTART;TZID=America/Santo_Domingo:${marca(e.fecha, e.horaInicio)}`,
      `DTEND;TZID=America/Santo_Domingo:${marca(e.fecha, e.horaFin)}`,
      `SUMMARY:${escapar(e.titulo)}`,
    );
    if (e.descripcion) lineas.push(`DESCRIPTION:${escapar(e.descripcion)}`);
    if (e.lugar) lineas.push(`LOCATION:${escapar(e.lugar)}`);
    lineas.push("END:VEVENT");
  }

  lineas.push("END:VCALENDAR");
  // El formato exige finales de línea CRLF, no solo salto.
  return lineas.map(plegar).join("\r\n") + "\r\n";
}
