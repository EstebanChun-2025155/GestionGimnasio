import { IncomingMessage, ServerResponse } from "http";
import { PlanNutricional } from "../models/planNutricional";
import { actualizarPlanNutricional, agregarPlanNutricional, buscarPlanNutricional, eliminarPlanNutricional, listarPlanesNutricionales } from "../services/planNutricionalService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasPlanNutricional(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaPlan = ruta.match(/^\/planes-nutricionales\/(\d+)$/);

    if (ruta === "/planes-nutricionales") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarPlanesNutricionales());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<PlanNutricional>(req);
            Respuesta.enviar(res, 201, await agregarPlanNutricional(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaPlan) {
        const id = Number(rutaPlan[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarPlanNutricional(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<PlanNutricional>(req);
            Respuesta.enviar(res, 200, await actualizarPlanNutricional(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const plan = await eliminarPlanNutricional(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Plan nutricional eliminado correctamente.",
                registro: plan
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/planes-nutricionales/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}