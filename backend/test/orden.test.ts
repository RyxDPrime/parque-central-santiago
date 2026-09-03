import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { movimiento, posicionAlCrear, posicionPedida } from "../src/dominio/orden";

describe("posicionPedida", () => {
  it("acepta enteros positivos, vengan como número o como texto", () => {
    assert.equal(posicionPedida(3), 3);
    assert.equal(posicionPedida("3"), 3);
  });

  it("descarta todo lo que no sea una posición válida", () => {
    assert.equal(posicionPedida(0), null);
    assert.equal(posicionPedida(-1), null);
    assert.equal(posicionPedida(1.5), null);
    assert.equal(posicionPedida("primera"), null);
    assert.equal(posicionPedida(undefined), null);
    assert.equal(posicionPedida(null), null);
  });
});

describe("posicionAlCrear", () => {
  it("sin posición pedida, va al final", () => {
    assert.equal(posicionAlCrear(null, 5), 6);
    assert.equal(posicionAlCrear(null, 0), 1);
  });

  it("respeta la posición pedida cuando cabe", () => {
    assert.equal(posicionAlCrear(2, 5), 2);
    assert.equal(posicionAlCrear(6, 5), 6);
  });

  // Sin este tope, pedir la posición 99 en una lista de cinco dejaría un hueco
  // entre la 6 y la 99, y el orden deja de ser una secuencia sin huecos.
  it("una posición fuera de rango se ajusta al final", () => {
    assert.equal(posicionAlCrear(99, 5), 6);
  });
});

describe("movimiento", () => {
  it("al subir una fila, las de en medio bajan un puesto", () => {
    assert.deepEqual(movimiento(5, 2, 10), { hasta: 2, direccion: "bajan" });
  });

  it("al bajar una fila, las de en medio suben un puesto", () => {
    assert.deepEqual(movimiento(2, 5, 10), { hasta: 5, direccion: "suben" });
  });

  it("dejarla donde estaba no mueve a nadie", () => {
    assert.deepEqual(movimiento(3, 3, 10), { hasta: 3, direccion: null });
  });

  it("no se puede mover más allá de la última posición", () => {
    assert.deepEqual(movimiento(4, 99, 10), { hasta: 10, direccion: "suben" });
  });

  it("mover la última al principio y la primera al final", () => {
    assert.deepEqual(movimiento(10, 1, 10), { hasta: 1, direccion: "bajan" });
    assert.deepEqual(movimiento(1, 10, 10), { hasta: 10, direccion: "suben" });
  });
});
