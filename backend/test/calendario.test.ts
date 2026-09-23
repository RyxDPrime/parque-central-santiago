import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { construirIcs } from "../src/config/calendario";

/**
 * El .ics no lo lee una persona: lo lee Google Calendar, Outlook o el iPhone,
 * y cuando algo está mal no avisan — descartan el evento en silencio. Por eso
 * se comprueba la forma del archivo, que es justo lo que no se ve al probarlo
 * a ojo.
 */

const UNO = {
  id: "solicitud-7",
  titulo: "Alquiler de kiosco — Kiosco La Mara",
  fecha: "2026-09-14",
  horaInicio: "09:00",
  horaFin: "14:00",
  descripcion: "Cumpleaños, unas 25 personas",
  lugar: "Kiosco La Mara, Parque Central de Santiago",
};

describe("construirIcs", () => {
  it("abre y cierra el calendario y el evento", () => {
    const ics = construirIcs("Mi reserva", [UNO]);
    for (const marca of ["BEGIN:VCALENDAR", "END:VCALENDAR", "BEGIN:VEVENT", "END:VEVENT"]) {
      assert.ok(ics.includes(marca), `falta ${marca}`);
    }
  });

  it("usa finales de linea CRLF, que es lo que exige el formato", () => {
    const ics = construirIcs("Mi reserva", [UNO]);
    assert.ok(ics.includes("\r\n"));
    // Ningún salto suelto: un \n sin su \r delante rompe a los lectores estrictos.
    assert.equal(/[^\r]\n/.test(ics), false);
  });

  it("pone la hora local con la zona del país", () => {
    const ics = construirIcs("Mi reserva", [UNO]);
    assert.ok(ics.includes("DTSTART;TZID=America/Santo_Domingo:20260914T090000"));
    assert.ok(ics.includes("DTEND;TZID=America/Santo_Domingo:20260914T140000"));
  });

  it("declara la zona horaria que usa, como exige el estandar", () => {
    const ics = construirIcs("Mi reserva", [UNO]);
    assert.ok(ics.includes("BEGIN:VTIMEZONE"));
    assert.ok(ics.includes("TZID:America/Santo_Domingo"));
    assert.ok(ics.includes("TZOFFSETTO:-0400"));
    // La zona va antes del primer evento que la nombra.
    assert.ok(ics.indexOf("END:VTIMEZONE") < ics.indexOf("BEGIN:VEVENT"));
  });

  it("escapa la coma, que de otro modo parte el campo en dos", () => {
    const ics = construirIcs("Mi reserva", [UNO]);
    assert.ok(ics.includes("Cumpleaños\\, unas 25 personas"));
  });

  it("escapa el salto de linea dentro de una descripcion", () => {
    const ics = construirIcs("X", [{ ...UNO, descripcion: "Primera\nSegunda" }]);
    assert.ok(ics.includes("DESCRIPTION:Primera\\nSegunda"));
  });

  it("da a cada evento un identificador estable, para que no se duplique", () => {
    const ics = construirIcs("X", [UNO]);
    assert.ok(ics.includes("UID:solicitud-7@parquecentralsantiagord.com"));
  });

  it("pliega las lineas largas con un espacio al principio de la continuacion", () => {
    const largo = "A".repeat(200);
    const ics = construirIcs("X", [{ ...UNO, titulo: largo }]);
    for (const linea of ics.split("\r\n")) {
      assert.ok(Buffer.byteLength(linea, "utf8") <= 75, "una linea pasa de 75 octetos");
    }
    assert.ok(ics.includes("\r\n A"), "la continuacion no empieza con espacio");
  });

  it("sin eventos sigue siendo un calendario valido, no un archivo roto", () => {
    const ics = construirIcs("Vacio", []);
    assert.ok(ics.includes("BEGIN:VCALENDAR"));
    assert.ok(ics.includes("END:VCALENDAR"));
    assert.equal(ics.includes("BEGIN:VEVENT"), false);
  });

  it("omite lugar y descripcion cuando no los hay", () => {
    const ics = construirIcs("X", [
      { id: "a", titulo: "T", fecha: "2026-01-02", horaInicio: "08:00", horaFin: "09:00" },
    ]);
    assert.equal(ics.includes("DESCRIPTION:"), false);
    assert.equal(ics.includes("LOCATION:"), false);
  });
});
