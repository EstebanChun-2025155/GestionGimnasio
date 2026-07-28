import { IncomingMessage, ServerResponse } from "http";
import { Sede } from "../models/sede";
import { actualizarSede, agregarSede, buscarSede, eliminarSede, listarSedes } from "../services/sedeService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasSede(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaSede = ruta.match(/^\/sedes\/(\d+)$/);

    if (ruta === "/sedes") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarSedes());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Sede>(req);
            Respuesta.enviar(res, 201, await agregarSede(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaSede) {
        const id = Number(rutaSede[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarSede(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Sede>(req);
            Respuesta.enviar(res, 200, await actualizarSede(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const sede = await eliminarSede(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Sede eliminada correctamente.",
                registro: sede
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/sedes/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}