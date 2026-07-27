import { pool } from "./database";

async function probarConexion(): Promise<void> {
    try {
        const conexion = await pool.getConnection();

        try {
            await conexion.ping();

            const [resultado] = await conexion.query(
                `
                    SELECT
                        DATABASE() AS baseDatos,
                        VERSION() AS versionMySQL,
                        NOW() AS fechaServidor
                `
            );

            console.log("Conexión a MySQL exitosa.");
            console.log(resultado);
        } finally {
            conexion.release();
        }
    } catch (error) {
        console.error("No fue posible conectar con MySQL.");

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }

        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

void probarConexion();