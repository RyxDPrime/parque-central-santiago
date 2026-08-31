# El correo del sitio

**Parque Central de Santiago** · Documento para el equipo administrativo
Ureña Limited Partners · Septiembre de 2026

Por qué los correos del sitio salen hoy desde una cuenta personal, qué hace falta para que salgan a nombre del Parque, y qué hay que pedirle a quién.

> **Sustituye al documento *"Clave de aplicación para el correo del sitio"*, de agosto.** Aquel pedía una clave de aplicación de Gmail para conectarse por SMTP. Ese camino ya no sirve, y conviene no seguirlo: el servidor donde vive el sitio tiene el SMTP bloqueado, y ninguna clave lo desbloquea.

---

## 1. Qué manda el sitio

Seis correos, todos automáticos.

| Cuándo | A quién |
|---|---|
| Llega un mensaje de contacto | Al Parque |
| Llega una sugerencia | Al Parque |
| Llega una solicitud de reserva | Al Parque, y acuse a quien la pidió |
| Llega un aporte | Al Parque, y acuse a quien lo ofrece |
| Se aprueba o se rechaza una reserva | A quien la solicitó |
| Se acepta o no se acepta un aporte | A quien lo ofreció |

Los cuatro últimos usan plantillas que el Parque edita desde el panel.

> **De esto depende que las reservas funcionen**
> Quien solicita un espacio no sabe si lo tiene hasta que le llega la respuesta. Si el correo falla, el sistema entero deja de cumplir lo que promete. Por eso está construido para avisar en la bandeja cuando un envío no sale, en vez de darlo por hecho.

---

## 2. Qué pasó con el camino anterior

El plan original era mandar los correos desde la cuenta de Gmail del Parque, conectándose por SMTP, que es la vía habitual. Para eso hacía falta una clave de aplicación, y ese era el trámite que pedía el documento de agosto.

**No funcionó, y no por configuración.** El servidor donde está alojado el sitio **bloquea la salida por SMTP** en el plan contratado. Es una restricción de la plataforma: ninguna credencial, ninguna cuenta y ninguna configuración la sortean.

Se perdieron varios intentos persiguiendo lo que parecía un problema de credenciales antes de dar con la causa.

**La solución fue cambiar de vía:** el sitio manda los correos a través de un servicio externo por HTTPS, que es el puerto de siempre y nunca está bloqueado. Funciona y está verificado.

---

## 3. Dónde está el problema hoy

El servicio de correo funciona, pero **está registrado a nombre de una cuenta personal del equipo de desarrollo**, y los correos salen desde esa dirección.

Para quien los recibe, un correo del Parque que llega desde una dirección personal de Gmail:

- Se ve poco institucional.
- Tiene más probabilidad de acabar en la carpeta de correo no deseado.
- Deja al Parque dependiendo de una cuenta que no controla.

**Funciona, pero no es sostenible cuando el sitio se abra al público.**

---

## 4. Qué hace falta

Dos gestiones, y ninguna requiere trabajo de nuestra parte hasta que estén hechas.

### 4.1 Pasar la cuenta del servicio de correo al Parque

Hoy la cuenta está a nombre personal. Debe estar a nombre del Parque, con un correo institucional, para que el Parque conserve el control aunque cambie el equipo de desarrollo.

**Qué necesitamos:** que el Parque indique con qué dirección institucional quiere abrirla.

### 4.2 Verificar el dominio del Parque en ese servicio

Es lo que permite que los correos salgan **desde una dirección del Parque** y no desde una personal. Consiste en añadir unos registros en la configuración del dominio: se hace una vez y se olvida.

**Qué necesitamos:** acceso a la configuración del dominio, o que quien lo administre añada los registros que le indiquemos.

> **Esto está esperando desde hace semanas**
> No es un trabajo pendiente nuestro: es un acceso que todavía no hemos recibido. Mientras no llegue, los correos seguirán saliendo desde la cuenta personal.

---

## 5. Qué NO hace falta

Para evitar que alguien repita el camino que ya no sirve:

- **No hace falta una clave de aplicación de Gmail.** Era para SMTP, que está bloqueado.
- **No hace falta cambiar de proveedor de correo** ni contratar nada nuevo.
- **No hace falta tocar la cuenta `asistentepcs@gmail.com`** para que el sitio funcione. Esa dirección sigue siendo la que *recibe* los mensajes del formulario, y eso no cambia.

---

## 6. Resumen

| Cosa | Estado |
|---|---|
| El sitio manda correos | **Funcionando y verificado** |
| Salen desde | Una cuenta personal del equipo de desarrollo |
| Llegan al Parque | Sí, a `asistentepcs@gmail.com` |
| Cuenta del servicio a nombre del Parque | **Pendiente** — falta que el Parque indique la dirección |
| Correos desde el dominio del Parque | **Pendiente** — falta acceso a la configuración del dominio |
