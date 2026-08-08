import { Router } from "express";
import { prisma } from "../config/db";
import { requireAuth } from "../middleware/auth";

// Fábrica genérica de rutas crear/editar/borrar para un modelo de Prisma.
// Las secciones administrables comparten la misma forma básica (una tabla con
// columnas simples + "orden"), así que en vez de repetir el mismo código por
// cada una, se genera una sola vez por modelo.
//
// Con `reorder` la posición se mantiene siempre como una secuencia 1..n sin
// huecos ni repetidos: al insertar en una posición ocupada, esa y las
// siguientes se corren una hacia abajo; al mover o borrar, se cierra el hueco.
// Todo va dentro de una transacción para que no queden posiciones a medias.

type ClienteTx = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

// Se accede al modelo por nombre para poder usar el cliente de la transacción.
// Se tipa como `any` a propósito: cada modelo de Prisma tiene su propio tipo
// estricto de "data" y no vale la pena reescribir esta fábrica por modelo solo
// para satisfacer eso; la validación real ocurre en la base de datos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Delegado = any;

export type ModeloOrdenable =
  | "juntaDirectivo"
  | "personalTecnico"
  | "instalacion"
  | "programa"
  | "galeriaItem"
  | "documentoFinanciero"
  | "puntoMapa"
  | "hito"
  | "norma"
  | "pasoReserva"
  | "formaApoyo"
  | "cifra";

export type ModeloCrud = ModeloOrdenable | "actividad" | "publicacion" | "texto";

// Campos que cada modelo acepta desde el formulario. Sin esta lista se pasaba
// `req.body` completo a Prisma, así que una petición podía traer campos que el
// panel no muestra (por ejemplo `id` o `createdAt`) y escribirlos igual.
const CAMPOS_PERMITIDOS: Record<ModeloCrud, readonly string[]> = {
  juntaDirectivo: ["institucion", "representante", "cargo", "fotoUrl", "logoUrl", "orden"],
  personalTecnico: ["nombre", "cargo", "bio", "fotoUrl", "orden"],
  instalacion: ["nombre", "descripcion", "cantidad", "orden"],
  programa: ["nombre", "categoria", "descripcion", "orden"],
  actividad: ["titulo", "descripcion", "fechaInicio", "fechaFin", "lugar", "imagenUrl"],
  publicacion: ["titulo", "tipo", "resumen", "contenido", "imagenUrl", "fecha", "destacada"],
  galeriaItem: ["titulo", "url", "tipo", "categoria", "orden"],
  documentoFinanciero: ["titulo", "tipo", "url", "fecha", "orden"],
  puntoMapa: ["nombre", "zona", "lat", "lng", "fotoUrl", "orden"],
  hito: ["fecha", "titulo", "texto", "orden"],
  norma: ["icono", "titulo", "texto", "orden"],
  pasoReserva: ["icono", "titulo", "texto", "orden"],
  formaApoyo: ["icono", "etiqueta", "titulo", "texto", "orden"],
  cifra: ["numero", "descripcion", "imagenUrl", "etiqueta", "enlaceTexto", "enlaceUrl", "orden"],
  // Los textos no se crean ni se borran: solo cambia su valor.
  texto: ["valor"],
};

function soloCamposPermitidos(modelo: ModeloCrud, body: unknown): Record<string, unknown> {
  const permitidos = CAMPOS_PERMITIDOS[modelo];
  const entrada = (body ?? {}) as Record<string, unknown>;
  const limpio: Record<string, unknown> = {};
  for (const campo of permitidos) {
    if (Object.prototype.hasOwnProperty.call(entrada, campo)) {
      limpio[campo] = entrada[campo];
    }
  }
  return limpio;
}

export function crudRoutes(
  modelo: ModeloCrud,
  // `soloEditar` deja unicamente la ruta de actualizar: se usa para los textos
  // del sitio, cuyas claves son fijas y no deben poder crearse ni borrarse.
  opciones: { reorder?: boolean; soloEditar?: boolean } = {},
): Router {
  const router = Router();
  const del = (cliente: ClienteTx | typeof prisma): Delegado =>
    (cliente as Record<string, Delegado>)[modelo];

  function posicionPedida(valor: unknown): number | null {
    const n = Number(valor);
    return Number.isInteger(n) && n > 0 ? n : null;
  }

  if (!opciones.soloEditar) {
    router.post("/", requireAuth, async (req, res, next) => {
    try {
      const creado = await prisma.$transaction(async (tx) => {
        const m = del(tx);
        const data = soloCamposPermitidos(modelo, req.body);

        if (opciones.reorder) {
          const total = await m.count();
          const pedida = posicionPedida(data.orden);
          // Sin posición explícita va al final; si la piden fuera de rango se
          // ajusta al final para no dejar huecos.
          const destino = pedida === null ? total + 1 : Math.min(pedida, total + 1);

          await m.updateMany({
            where: { orden: { gte: destino } },
            data: { orden: { increment: 1 } },
          });
          data.orden = destino;
        }

        return m.create({ data });
      });
      res.status(201).json(creado);
    } catch (err) {
      next(err);
    }
  });

  }

  router.put("/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const actualizado = await prisma.$transaction(async (tx) => {
        const m = del(tx);
        const data = soloCamposPermitidos(modelo, req.body);

        if (opciones.reorder && data.orden !== undefined) {
          const actual = await m.findUnique({ where: { id } });
          const pedida = posicionPedida(data.orden);

          if (actual && pedida !== null) {
            const total = await m.count();
            const desde = actual.orden as number;
            const hasta = Math.min(pedida, total);

            if (hasta < desde) {
              // Sube: los que estaban entre la posición nueva y la vieja bajan uno.
              await m.updateMany({
                where: { orden: { gte: hasta, lt: desde } },
                data: { orden: { increment: 1 } },
              });
            } else if (hasta > desde) {
              // Baja: los que quedaron por encima suben uno.
              await m.updateMany({
                where: { orden: { gt: desde, lte: hasta } },
                data: { orden: { decrement: 1 } },
              });
            }
            data.orden = hasta;
          } else {
            delete data.orden;
          }
        }

        return m.update({ where: { id }, data });
      });
      res.json(actualizado);
    } catch (err) {
      next(err);
    }
  });

  if (!opciones.soloEditar) {
    router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      await prisma.$transaction(async (tx) => {
        const m = del(tx);
        const actual = opciones.reorder ? await m.findUnique({ where: { id } }) : null;

        await m.delete({ where: { id } });

        if (actual) {
          // Cierra el hueco que dejó el registro borrado.
          await m.updateMany({
            where: { orden: { gt: actual.orden as number } },
            data: { orden: { decrement: 1 } },
          });
        }
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
    });
  }

  return router;
}
