import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { choquesCon, cupoDe, hayCupo, seSolapan } from "../src/dominio/reservas";

describe("seSolapan", () => {
  const tarde = { horaInicio: "14:00", horaFin: "18:00" };

  it("se pisan cuando una empieza dentro de la otra", () => {
    assert.equal(seSolapan(tarde, { horaInicio: "16:00", horaFin: "20:00" }), true);
    assert.equal(seSolapan(tarde, { horaInicio: "12:00", horaFin: "15:00" }), true);
  });

  it("se pisan cuando una está contenida en la otra", () => {
    assert.equal(seSolapan(tarde, { horaInicio: "15:00", horaFin: "16:00" }), true);
    assert.equal(seSolapan({ horaInicio: "15:00", horaFin: "16:00" }, tarde), true);
  });

  // El caso que decide si el Parque puede encadenar dos actividades el mismo
  // día. Si esto diera "true", la segunda no se podría aprobar nunca.
  it("tocarse en el borde no es pisarse", () => {
    assert.equal(seSolapan(tarde, { horaInicio: "18:00", horaFin: "20:00" }), false);
    assert.equal(seSolapan(tarde, { horaInicio: "10:00", horaFin: "14:00" }), false);
  });

  it("no se pisan cuando están separadas", () => {
    assert.equal(seSolapan(tarde, { horaInicio: "08:00", horaFin: "09:00" }), false);
  });

  it("ordena las horas por el reloj y no por el texto", () => {
    // "09:00" < "10:00" como texto solo porque van con el cero delante.
    assert.equal(seSolapan({ horaInicio: "09:00", horaFin: "11:00" }, { horaInicio: "10:00", horaFin: "12:00" }), true);
  });
});

describe("cupoDe", () => {
  it("sin unidades declaradas, se aparta de uno en uno", () => {
    assert.equal(cupoDe(null), 1);
    assert.equal(cupoDe(undefined), 1);
    assert.equal(cupoDe(0), 1);
  });

  it("con unidades, admite tantas a la vez como unidades", () => {
    assert.equal(cupoDe(8), 8);
  });
});

describe("choquesCon", () => {
  const apartadas = [
    { horaInicio: "08:00", horaFin: "10:00", nombre: "mañana" },
    { horaInicio: "14:00", horaFin: "16:00", nombre: "tarde" },
    { horaInicio: "16:00", horaFin: "18:00", nombre: "seguida" },
  ];

  it("devuelve solo lo que se pisa", () => {
    const choques = choquesCon({ horaInicio: "15:00", horaFin: "17:00" }, apartadas);
    assert.deepEqual(choques.map((c) => c.nombre), ["tarde", "seguida"]);
  });

  it("un hueco libre no choca con nada", () => {
    assert.deepEqual(choquesCon({ horaInicio: "10:00", horaFin: "14:00" }, apartadas), []);
  });
});

describe("hayCupo", () => {
  it("queda sitio mientras lo que choca no llegue al cupo", () => {
    assert.equal(hayCupo(0, 1), true);
    assert.equal(hayCupo(1, 1), false);
    assert.equal(hayCupo(7, 8), true);
    assert.equal(hayCupo(8, 8), false);
  });
});
