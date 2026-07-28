import { IncomingMessage, ServerResponse } from "http";
import { Entrenador } from "../models/entrenador";
import { actualizarEntrenador, agregarEntrenador, buscarEntrenador, eliminarEntrenador, listarEntrenadores } from "../services/entrenadorService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasEntrenador(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaEntrenador = ruta.match(/^\/entrenadores\/(\d+)$/);

    if (ruta === "/entrenadores") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarEntrenadores());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Entrenador>(req);
            Respuesta.enviar(res, 201, await agregarEntrenador(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaEntrenador) {
        const id = Number(rutaEntrenador[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarEntrenador(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Entrenador>(req);
            Respuesta.enviar(res, 200, await actualizarEntrenador(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const entrenador = await eliminarEntrenador(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Entrenador eliminado correctamente.",
                registro: entrenador
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/entrenadores/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}