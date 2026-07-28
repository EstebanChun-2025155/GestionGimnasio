import { IncomingMessage, ServerResponse } from "http";
import { manejarRutasAsistencia } from "./asistenciaRouter";
import { manejarRutasCliente } from "./clienteRouter";
import { manejarRutasEjercicio } from "./ejercicioRouter";
import { manejarRutasEntrenador } from "./entrenadorRouter";
import { manejarRutasMembresia } from "./membresiaRouter";
import { manejarRutasPago } from "./pagoRouter";
import { manejarRutasPlanNutricional } from "./planNutricionalRouter";
import { manejarRutasRutina } from "./rutinaRouter";
import { manejarRutasSede } from "./sedeRouter";
import { manejarRutasUsuario } from "./usuarioRouter";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutas(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const ruta = (req.url || "").split("?")[0];

        if (ruta === "/" && req.method === "GET") {
            Respuesta.enviar(res, 200, { mensaje: "API de Gestión de Gimnasio" });
            return;
        }

        if (await manejarRutasUsuario(req, res)) return;
        if (await manejarRutasSede(req, res)) return;
        if (await manejarRutasMembresia(req, res)) return;
        if (await manejarRutasCliente(req, res)) return;
        if (await manejarRutasEntrenador(req, res)) return;
        if (await manejarRutasPago(req, res)) return;
        if (await manejarRutasRutina(req, res)) return;
        if (await manejarRutasEjercicio(req, res)) return;
        if (await manejarRutasAsistencia(req, res)) return;
        if (await manejarRutasPlanNutricional(req, res)) return;

        Respuesta.enviar(res, 404, { mensaje: "Ruta inexistente." });
    } catch (error) {
        Respuesta.manejarError(res, error);
    }
}