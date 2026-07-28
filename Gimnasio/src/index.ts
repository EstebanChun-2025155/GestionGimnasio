import "dotenv/config";
import { Server } from "./server/server";

const server = new Server();

server.iniciar().catch(error => {
    console.error("No fue posible iniciar el servidor.");

    if (error instanceof Error)
        console.error(error.message);
    else
        console.error(error);

    process.exit(1);
});

process.on("SIGINT", async () => {
    console.log("\nCerrando aplicación...");

    try {
        await server.detener();
        process.exit(0);
    } catch (error) {
        console.error("No fue posible cerrar correctamente.", error);
        process.exit(1);
    }
});