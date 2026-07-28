import { createServer, Server as HttpServer } from "http";
import { cerrarConexion, verificarConexion } from "../config/database";
import { manejarRutas } from "../router/router";

export class Server {
    private readonly servidor: HttpServer;
    private readonly puerto: number;

    constructor(puerto: number = Number(process.env.PORT) || 3000) {
        this.puerto = puerto;
        this.servidor = createServer((req, res) => {
            void manejarRutas(req, res);
        });
    }

    async iniciar(): Promise<void> {
        await verificarConexion();

        await new Promise<void>((resolve, reject) => {
            const manejarError = (error: Error) => reject(error);
            this.servidor.once("error", manejarError);

            this.servidor.listen(this.puerto, () => {
                this.servidor.off("error", manejarError);
                console.log(`Servidor ejecutándose en http://localhost:${this.puerto}`);
                resolve();
            });
        });
    }

    async detener(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.servidor.close(error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        await cerrarConexion();
        console.log("Servidor y conexión a MySQL cerrados.");
    }
}