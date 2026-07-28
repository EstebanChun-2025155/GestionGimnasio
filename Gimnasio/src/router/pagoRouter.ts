import { IncomingMessage, ServerResponse } from "http";
import { Pago } from "../models/pago";
import { actualizarPago, agregarPago, buscarPago, eliminarPago, listarPagos } from "../services/pagoService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasPago(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaPago = ruta.match(/^\/pagos\/(\d+)$/);

    if (ruta === "/pagos") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarPagos());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Pago>(req);
            Respuesta.enviar(res, 201, await agregarPago(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaPago) {
        const id = Number(rutaPago[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarPago(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Pago>(req);
            Respuesta.enviar(res, 200, await actualizarPago(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const pago = await eliminarPago(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Pago eliminado correctamente.",
                registro: pago
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/pagos/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}