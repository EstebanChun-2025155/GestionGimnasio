import { IncomingMessage, ServerResponse } from "http";
import { Membresia } from "../models/membresia";
import { actualizarMembresia, agregarMembresia, buscarMembresia, eliminarMembresia, listarMembresias } from "../services/membresiaService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasMembresia(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaMembresia = ruta.match(/^\/membresias\/(\d+)$/);

    if (ruta === "/membresias") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarMembresias());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Membresia>(req);
            Respuesta.enviar(res, 201, await agregarMembresia(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaMembresia) {
        const id = Number(rutaMembresia[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarMembresia(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Membresia>(req);
            Respuesta.enviar(res, 200, await actualizarMembresia(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const membresia = await eliminarMembresia(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Membresía eliminada correctamente.",
                registro: membresia
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/membresias/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}