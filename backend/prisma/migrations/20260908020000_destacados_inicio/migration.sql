-- El carrusel de la portada pasa a tener su propia tabla.
--
-- Hasta ahora mostraba los programas, primero escritos en el código y después
-- leídos de la tabla de Programas. Ninguna de las dos servía: la lista de
-- programas es el catálogo completo del parque, y el carrusel es una selección
-- de la portada. Atados, agregar un programa lo metía en la portada sin que
-- nadie lo decidiera, y la foto buena para una tarjeta tenía que servir también
-- de fondo a pantalla completa.
--
-- Se siembra con lo que el carrusel enseña hoy, para que el despliegue no
-- cambie nada a la vista. A partir de ahí las dos listas viven separadas.

CREATE TABLE "DestacadoInicio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "enlaceTexto" TEXT,
    "enlaceUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestacadoInicio_pkey" PRIMARY KEY ("id")
);

INSERT INTO "DestacadoInicio" ("titulo", "categoria", "imagenUrl", "enlaceTexto", "enlaceUrl", "orden", "updatedAt")
SELECT "nombre", "categoria", "fotoUrl", 'Conocer más', '/programas-y-servicios', "orden", NOW()
FROM "Programa"
ORDER BY "orden";
