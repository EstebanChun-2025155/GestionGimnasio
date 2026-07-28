import { IncomingMessage, ServerResponse } from "http";
import { Asistencia } from "../models/asistencia";
import { actualizarAsistencia, agregarAsistencia, buscarAsistencia, eliminarAsistencia, listarAsistencias } from "../services/asistenciaService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasAsistencia(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaAsistencia = ruta.match(/^\/asistencias\/(\d+)$/);

    if (ruta === "/asistencias") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarAsistencias());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Asistencia>(req);
            Respuesta.enviar(res, 201, await agregarAsistencia(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaAsistencia) {
        const id = Number(rutaAsistencia[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarAsistencia(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Asistencia>(req);
            Respuesta.enviar(res, 200, await actualizarAsistencia(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const asistencia = await eliminarAsistencia(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Asistencia eliminada correctamente.",
                registro: asistencia
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/asistencias/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}