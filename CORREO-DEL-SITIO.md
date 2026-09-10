# El correo del sitio

**Parque Central de Santiago** · Documento para el equipo administrativo
Ureña Limited Partners · 10 de septiembre de 2026

Los mensajes del sitio ya llegan al correo institucional del Parque. Falta lo otro: que además *salgan* a su nombre. Este documento explica la diferencia, qué hace falta para cerrarla, y por qué el orden de los pasos importa.

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

Hay dos direcciones en juego y conviene no confundirlas, porque una ya está resuelta y la otra no.

| | Dirección | Estado |
|---|---|---|
| **A dónde llegan** los mensajes del sitio | `info@parquecentralsantiagord.com` | **Resuelto** |
| **Desde dónde salen** los correos del sitio | Una cuenta personal del equipo | **Pendiente** |

El destino ya es institucional: lo que escriben los ciudadanos en contacto, sugerencias y aportes cae en la bandeja del Parque. Eso se cambió y quedó comprobado.

Lo que sigue pendiente es el remitente. El servicio de correo **está registrado a nombre de una cuenta personal del equipo de desarrollo**, y los correos salen desde esa dirección.

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
- **No hace falta tocar la cuenta `asistentepcs@gmail.com`** para que el sitio funcione. Ya no recibe nada: hoy es solo la dirección desde la que salen los correos, hasta que se verifique el dominio.
- **No hay que cambiar el remitente a mano antes de verificar el dominio.** Ver el aviso de la sección 6: hacerlo antes tumba todo el correo saliente.

---

## 6. Resumen

| Cosa | Estado |
|---|---|
| El sitio manda correos | **Funcionando y verificado** |
| Llegan al Parque | Sí, a `info@parquecentralsantiagord.com` |
| Salen desde | Una cuenta personal del equipo de desarrollo |
| Cuenta del servicio a nombre del Parque | **Pendiente** — falta que el Parque indique la dirección |
| Correos desde el dominio del Parque | **Pendiente** — falta verificar el dominio |

### El orden importa

El servicio de correo solo acepta enviar desde direcciones cuyo dominio esté verificado con él. Cambiar el remitente antes de esa verificación no deja los correos "un poco peor": los **rechaza todos**.

Y donde más se nota no es en el formulario de contacto, sino en las reservas: quien pide un espacio no sabe si lo tiene hasta que le llega la respuesta. Sin correo saliente, esa persona se queda esperando una respuesta que el Parque cree haber enviado.

Por eso los pasos van en este orden, y no en otro:

1. Añadir al dominio `parquecentralsantiagord.com` los registros que pide el servicio de correo.
2. Comprobar en el servicio que el dominio aparece **verificado**.
3. Recién entonces, cambiar el remitente a `info@parquecentralsantiagord.com`.
4. Mandar un correo de prueba y confirmar que llega.
