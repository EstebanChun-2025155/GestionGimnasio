import "dotenv/config";
import mysql = require("mysql2/promise");

export const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Stidan_ffx09",
    database: process.env.DB_NAME || "db_Gimnasio_in5cm",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    decimalNumbers: true
});

export async function verificarConexion(): Promise<void> {
    const conexion = await pool.getConnection();

    try {
        await conexion.ping();
        console.log("Conexión a MySQL establecida.");
    } finally {
        conexion.release();
    }
}

export async function cerrarConexion(): Promise<void> {
    await pool.end();
}