import { IncomingMessage, ServerResponse } from "http";
import { Usuario } from "../models/usuario";
import { actualizarUsuario, agregarUsuario, buscarUsuario, eliminarUsuario, listarUsuarios } from "../services/usuarioService";
import { Respuesta } from "../utils/respuesta";

export async function manejarRutasUsuario(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const ruta = (req.url || "").split("?")[0];
    const metodo = req.method || "";
    const rutaUsuario = ruta.match(/^\/usuarios\/(\d+)$/);

    if (ruta === "/usuarios") {
        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await listarUsuarios());
            return true;
        }

        if (metodo === "POST") {
            const datos = await Respuesta.leerJson<Usuario>(req);
            Respuesta.enviar(res, 201, await agregarUsuario(datos));
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (rutaUsuario) {
        const id = Number(rutaUsuario[1]);

        if (metodo === "GET") {
            Respuesta.enviar(res, 200, await buscarUsuario(id));
            return true;
        }

        if (metodo === "PUT") {
            const datos = await Respuesta.leerJson<Usuario>(req);
            Respuesta.enviar(res, 200, await actualizarUsuario(id, datos));
            return true;
        }

        if (metodo === "DELETE") {
            const usuario = await eliminarUsuario(id);
            Respuesta.enviar(res, 200, {
                mensaje: "Usuario eliminado correctamente.",
                registro: usuario
            });
            return true;
        }

        Respuesta.enviar(res, 405, { mensaje: "Método incorrecto." });
        return true;
    }

    if (ruta.startsWith("/usuarios/")) {
        Respuesta.enviar(res, 400, { mensaje: "ID inválido." });
        return true;
    }

    return false;
}