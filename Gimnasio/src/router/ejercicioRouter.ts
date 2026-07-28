import { IncomingMessage, ServerResponse } from "http";
import { Ejercicio } from "../models/ejercicio";
import { actualizarEjercicio, agregarEjercicio, buscarEjercicio, eliminarEjercicio, listarEjercicios } from "../services/ejercicioService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasEjercicio(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaEjercicio = ruta.match(/^\/ejercicios\/(\d+)$/);

    if (ruta === "/ejercicios") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarEjercicios());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Ejercicio>(req);
            Respuesta.enviar(res, 201, await agregarEjercicio(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaEjercicio) {
        const id = Number(rutaEjercicio[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarEjercicio(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Ejercicio>(req);
            Respuesta.enviar(res, 200, await actualizarEjercicio(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const ejercicio = await eliminarEjercicio(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Ejercicio eliminado correctamente.",
                registro: ejercicio
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/ejercicios/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}