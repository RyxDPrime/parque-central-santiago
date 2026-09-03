import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { debeDeclarar, umbralDe } from "../src/dominio/aportes";

describe("umbralDe", () => {
  it("lee la cifra como la escriba el Parque", () => {
    assert.equal(umbralDe("25000"), 25000);
    assert.equal(umbralDe("RD$ 25,000"), 25000);
    assert.equal(umbralDe("25.000"), 25000);
  });

  // En cero se le pregunta a todo el mundo, que es el lado seguro de
  // equivocarse: de lo contrario, un texto mal escrito en el panel dejaría de
  // pedir la identificación sin que nadie se entere.
  it("lo que no se puede leer cuenta como cero", () => {
    assert.equal(umbralDe(""), 0);
    assert.equal(umbralDe(null), 0);
    assert.equal(umbralDe(undefined), 0);
    assert.equal(umbralDe("por definir"), 0);
    assert.equal(umbralDe("0"), 0);
  });
});

describe("debeDeclarar", () => {
  it("un patrocinio declara siempre, con monto o sin él", () => {
    assert.equal(debeDeclarar({ tipo: "patrocinio" }, 25000), true);
    assert.equal(debeDeclarar({ tipo: "patrocinio", monto: 500 }, 25000), true);
  });

  it("el dinero declara desde el umbral, inclusive", () => {
    assert.equal(debeDeclarar({ tipo: "dinero", monto: 24999 }, 25000), false);
    assert.equal(debeDeclarar({ tipo: "dinero", monto: 25000 }, 25000), true);
    assert.equal(debeDeclarar({ tipo: "dinero", monto: 90000 }, 25000), true);
  });

  it("el voluntariado no declara nunca: no hay fondos", () => {
    assert.equal(debeDeclarar({ tipo: "voluntariado" }, 0), false);
    assert.equal(debeDeclarar({ tipo: "voluntariado", monto: 90000 }, 25000), false);
  });

  it("con el umbral en cero, todo aporte en dinero declara", () => {
    assert.equal(debeDeclarar({ tipo: "dinero", monto: 100 }, 0), true);
    assert.equal(debeDeclarar({ tipo: "dinero" }, 0), true);
  });
});
