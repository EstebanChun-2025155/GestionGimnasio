import { readFile, writeFile } from "fs/promises";
import { Rutina } from "../models/rutina";
import { asignarEstadoSeguimiento, validarId, validarNombre, validarObjetivo} from "../utils/validaciones";

const ruta = "./src/data/rutina.json";

async function leerRutinas(): Promise<Rutina[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarRutinas(rutinas: Rutina[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(rutinas, null, 2));
}

function validarRutina(rutina: Rutina): Rutina {
    if (!validarId(rutina.idCliente))
        throw new Error("ID de cliente inválido.");

    if (!validarId(rutina.idEntrenador))
        throw new Error("ID de entrenador inválido.");

    if (!validarNombre(rutina.nombre))
        throw new Error("Nombre de rutina inválido.");

    if (!validarObjetivo(rutina.objetivo))
        throw new Error("Objetivo inválido.");

    return {
        ...rutina,
        nombre: rutina.nombre.trim(),
        objetivo: rutina.objetivo.trim(),
        estado: asignarEstadoSeguimiento(rutina.estado)
    };
}

export async function listarRutinas(): Promise<Rutina[]> {
    return leerRutinas();
}

export async function buscarRutina(id: number): Promise<Rutina> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const rutinas = await leerRutinas();
    const rutina = rutinas.find(r => r.id === id);

    if (!rutina)
        throw new Error("Rutina no encontrada.");

    return rutina;
}

export async function agregarRutina(  rutina: Rutina): Promise<Rutina> {
    if (!validarId(rutina.id))
        throw new Error("ID inválido.");

    const rutinas = await leerRutinas();

    if (rutinas.some(r => r.id === rutina.id))
        throw new Error("El ID ya existe.");

    const nuevaRutina = validarRutina(rutina);

    const rutinaExiste = rutinas.some(
        r => r.idCliente === nuevaRutina.idCliente && r.nombre.toLowerCase() === nuevaRutina.nombre.toLowerCase()
    );

    if (rutinaExiste)
        throw new Error("El cliente ya tiene una rutina con ese nombre.");

    rutinas.push(nuevaRutina);
    await guardarRutinas(rutinas);

    return nuevaRutina;
}

export async function actualizarRutina(id: number, datos: Rutina): Promise<Rutina> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const rutinas = await leerRutinas();
    const posicion = rutinas.findIndex(r => r.id === id);

    if (posicion === -1)
        throw new Error("Rutina no encontrada.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID de la rutina.");

    const rutinaActualizada = validarRutina(datos);

    const rutinaExiste = rutinas.some(
        (r, indice) => indice !== posicion &&
            r.idCliente === rutinaActualizada.idCliente && r.nombre.toLowerCase() === rutinaActualizada.nombre.toLowerCase()
    );

    if (rutinaExiste)
        throw new Error("El cliente ya tiene una rutina con ese nombre.");

    rutinas[posicion] = rutinaActualizada;
    await guardarRutinas(rutinas);

    return rutinaActualizada;
}

export async function eliminarRutina(id: number): Promise<Rutina> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const rutinas = await leerRutinas();
    const posicion = rutinas.findIndex(r => r.id === id);

    if (posicion === -1)
        throw new Error("Rutina no encontrada.");

    const [rutinaEliminada] = rutinas.splice(posicion, 1);
    await guardarRutinas(rutinas);

    return rutinaEliminada;
}