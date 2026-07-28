import { IncomingMessage, ServerResponse } from "http";
import { Rutina } from "../models/rutina";
import { actualizarRutina, agregarRutina, buscarRutina, eliminarRutina, listarRutinas } from "../services/rutinaService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasRutina(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaRutina = ruta.match(/^\/rutinas\/(\d+)$/);

    if (ruta === "/rutinas") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarRutinas());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Rutina>(req);
            Respuesta.enviar(res, 201, await agregarRutina(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaRutina) {
        const id = Number(rutaRutina[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarRutina(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Rutina>(req);
            Respuesta.enviar(res, 200, await actualizarRutina(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const rutina = await eliminarRutina(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Rutina eliminada correctamente.",
                registro: rutina
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/rutinas/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}