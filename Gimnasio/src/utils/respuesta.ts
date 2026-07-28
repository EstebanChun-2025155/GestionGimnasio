import {
    IncomingMessage,
    ServerResponse
} from "http";

export class Respuesta {
    static enviar(
        response: ServerResponse,
        estado: number,
        contenido: unknown
    ): void {
        response.writeHead(estado, {
            "Content-Type": "application/json; charset=utf-8"
        });

        response.end(JSON.stringify(contenido));
    }

    static leerJson<T>(
        request: IncomingMessage
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            let contenido = "";

            request.setEncoding("utf-8");

            request.on("data", fragmento => {
                contenido += fragmento;
            });

            request.on("end", () => {
                if (!contenido.trim()) {
                    reject(new Error(
                        "El cuerpo de la petición está vacío."
                    ));

                    return;
                }

                try {
                    resolve(JSON.parse(contenido) as T);
                } catch {
                    reject(new Error(
                        "El cuerpo de la petición no contiene JSON válido."
                    ));
                }
            });

            request.on("error", reject);
        });
    }

    static manejarError(
        response: ServerResponse,
        error: unknown
    ): void {
        const codigoMysql =
            typeof error === "object" &&
            error !== null &&
            "code" in error
                ? String(
                    (error as { code: unknown }).code
                )
                : "";

        if (codigoMysql === "ER_DUP_ENTRY") {
            Respuesta.enviar(response, 409, {
                mensaje: "El registro ya existe."
            });

            return;
        }

        if (codigoMysql === "ER_NO_REFERENCED_ROW_2") {
            Respuesta.enviar(response, 400, {
                mensaje: "Uno de los registros relacionados no existe."
            });

            return;
        }

        if (codigoMysql === "ER_ROW_IS_REFERENCED_2") {
            Respuesta.enviar(response, 409, {
                mensaje: "No se puede eliminar porque el registro está siendo utilizado."
            });

            return;
        }

        if (!(error instanceof Error)) {
            Respuesta.enviar(response, 500, {
                mensaje: "Error interno del servidor."
            });

            return;
        }

        if (/no encontrad/i.test(error.message)) {
            Respuesta.enviar(response, 404, {
                mensaje: error.message
            });

            return;
        }

        if (
            /ya existe/i.test(error.message) ||
            /ya pertenece/i.test(error.message) ||
            /ya contiene/i.test(error.message)
        ) {
            Respuesta.enviar(response, 409, {
                mensaje: error.message
            });

            return;
        }

        Respuesta.enviar(response, 400, {
            mensaje: error.message
        });
    }
}