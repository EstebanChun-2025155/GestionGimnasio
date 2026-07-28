import { IncomingMessage, ServerResponse } from "http";
import { Cliente } from "../models/cliente";
import { actualizarCliente, agregarCliente, buscarCliente, eliminarCliente, listarClientes } from "../services/clienteService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasCliente(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaCliente = ruta.match(/^\/clientes\/(\d+)$/);

    if (ruta === "/clientes") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarClientes());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Cliente>(req);
            Respuesta.enviar(res, 201, await agregarCliente(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaCliente) {
        const id = Number(rutaCliente[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarCliente(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Cliente>(req);
            Respuesta.enviar(res, 200, await actualizarCliente(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const cliente = await eliminarCliente(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Cliente eliminado correctamente.",
                registro: cliente
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/clientes/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}