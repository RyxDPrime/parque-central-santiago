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
- `BREVO_API_KEY` / `MAIL_FROM` / `CONTACT_TO_EMAIL` — correo saliente (formularios, acuses y respuestas). Se manda por la API HTTPS de Brevo y no por SMTP: el servidor tiene bloqueada esa salida
- `UPLOADS_DIR` — carpeta de las fotos y documentos subidos desde el panel
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

Se despliegan **tres servicios** dentro de un mismo proyecto de Railway, dos apuntando a este repo (con distinto Root Directory) y uno de base de datos:

### 1. PostgreSQL
Agregar el plugin de Railway (New → Database → PostgreSQL). Railway genera su propia `DATABASE_URL`.

### 2. Backend
- **Root Directory**: `backend`
- Build y start ya están definidos en `backend/package.json` / `backend/railway.json` (Railway los detecta solo): build corre `tsc`, start corre `prisma migrate deploy` y luego levanta el servidor. No hace falta configurar nada extra a mano.
- Variables de entorno a copiar de `backend/.env.example`, con estos valores reales:
  - `DATABASE_URL` → referenciar la del servicio de Postgres (Railway permite enlazarla con `${{Postgres.DATABASE_URL}}`)
  - `BREVO_API_KEY`, `MAIL_FROM`, `CONTACT_TO_EMAIL` → la clave real de Brevo y el correo del Parque
  - `CORS_ORIGIN` → la URL pública que Railway le asigne al servicio de frontend
- Healthcheck configurado en `/api/health`.
- **Volumen para los archivos subidos**: el servicio necesita un volumen de Railway montado en la ruta a la que apunte `UPLOADS_DIR` (por omisión `backend/uploads`). Sin él, las fotos y los PDF que cargue el Parque desde el panel desaparecen en el siguiente despliegue, y las rutas guardadas en la base quedan apuntando a archivos que ya no existen (recuperarlo es volver a subirlos con `scripts/restaurar-uploads.mjs`).

### 3. Frontend
- **Root Directory**: `frontend`
- Build: `npm run build` (ya lo detecta Railway). Start: `npm run start` (sirve `dist/` con `serve`, con fallback de rutas para el SPA).
- Variable de entorno: `VITE_API_URL` → la URL pública del backend.
  - **Importante**: Vite incrusta esta variable *durante el build*, no en tiempo de ejecución. Hay que configurarla en Railway **antes** del primer deploy del frontend (o forzar un redeploy después de cambiarla), de lo contrario el sitio queda apuntando al backend equivocado.

### Orden recomendado
Desplegar primero Postgres, luego backend (para tener su URL pública), y al final el frontend usando esa URL en `VITE_API_URL`.

## Estado

Fase 1 en desarrollo activo. Contenido pendiente por confirmar con el Parque: cifras del parque, plano/mapa, fotos y reseñas del equipo, fecha de fundación oficial, y el texto definitivo de misión y visión.

---
Equipo ULP: Junior Ureña, José Luis Alonso y Yuji Yamaki.
