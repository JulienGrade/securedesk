import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`SecureDesk disponible sur le port ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} reçu, arrêt en cours`);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
