import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`API del Parque Central de Santiago escuchando en el puerto ${env.port}`);
});
