-- Una institucion puede registrarse sin representante: el Parque manda las
-- entidades antes de saber a quien van a designar, y exigir el nombre obligaba
-- a inventarse una persona para poder guardar la entidad.
ALTER TABLE "JuntaDirectivo" ALTER COLUMN "representante" DROP NOT NULL;
ALTER TABLE "JuntaDirectivo" ALTER COLUMN "cargo" DROP NOT NULL;
