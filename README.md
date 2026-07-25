# Parque Central de Santiago — Sitio Web

Sitio web institucional del Parque Central de Santiago, desarrollado por **Ureña Limited Partners (ULP)**.

Este repositorio corresponde a la **Fase 1** del proyecto: presencia institucional del parque (quién es, qué ofrece y cómo contactarlo).

## Estructura del proyecto

```
Parque Central/
├── backend/     API (Node.js + Express + TypeScript + Prisma + PostgreSQL)
└── frontend/    Sitio web (React + Vite + TypeScript)
```

## Backend

Expone los datos institucionales (junta directiva, instalaciones, programas, actividades, galería, aliados) y procesa el formulario de contacto.

```bash
cd backend
npm install
cp .env.example .env   # completar con los valores reales
npm run prisma:migrate
npm run prisma:seed
npm run dev             # http://localhost:4000
```

Variables de entorno relevantes (ver `.env.example`):

- `DATABASE_URL` — conexión a PostgreSQL
- `SMTP_*` / `MAIL_FROM` / `CONTACT_TO_EMAIL` — envío del formulario de contacto
- `CORS_ORIGIN` — origen permitido en producción (en desarrollo se acepta cualquier `localhost`)

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL apuntando al backend
npm run dev             # http://localhost:5173 (o el siguiente puerto libre)
```

Páginas: Inicio, Sobre el Parque, Misión y Visión, Instalaciones y Servicios, Programas y Proyectos, Junta Directiva, Actividades, Galería, Aliados y Patrocinadores, Transparencia, Contacto.

## Despliegue (Railway)

El plan es desplegar `backend` y `frontend` como dos servicios independientes en Railway, más un servicio de PostgreSQL:

1. **PostgreSQL**: agregar el plugin de Railway y copiar su `DATABASE_URL` a las variables del servicio de backend.
2. **Backend**: desplegar la carpeta `backend/` (root directory `backend`), build `npm run build`, start `npm run start`. Configurar ahí las variables de `.env.example` (incluyendo `CORS_ORIGIN` con la URL pública del frontend).
3. **Frontend**: desplegar la carpeta `frontend/` (root directory `frontend`), build `npm run build`, sirviendo `dist/`. Configurar `VITE_API_URL` con la URL pública del backend.

## Estado

Fase 1 en desarrollo activo. Contenido pendiente por confirmar con el Parque: cifras del parque, plano/mapa, fotos y reseñas del equipo, fecha de fundación oficial, y el texto definitivo de misión y visión.

---
Equipo ULP: Junior Ureña, José Luis Alonso y Yuji Yamaki.
