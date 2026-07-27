import { readFile, writeFile } from "fs/promises";
import { Asistencia } from "../models/asistencia";
import { validarFechaIngreso, validarId, validarObservaciones} from "../utils/validaciones";

const ruta = "./src/data/asistencia.json";

async function leerAsistencias(): Promise<Asistencia[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarAsistencias(asistencias: Asistencia[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(asistencias, null, 2));
}

function validarHora(hora: string): boolean {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

function validarAsistencia( asistencia: Asistencia): Asistencia {
    if (!validarId(asistencia.idCliente))
        throw new Error("ID de cliente inválido.");

    if (!validarId(asistencia.idSede))
        throw new Error("ID de sede inválido.");

    if (!validarFechaIngreso(asistencia.fecha))
        throw new Error("Fecha de asistencia inválida.");

    if (!validarHora(asistencia.horaEntrada))
        throw new Error("Hora de entrada inválida.");

    if (!validarHora(asistencia.horaSalida))
        throw new Error("Hora de salida inválida.");

    if (asistencia.horaSalida <= asistencia.horaEntrada)
        throw new Error( "La hora de salida debe ser posterior a la entrada.");

    if (!validarObservaciones(asistencia.observaciones))
        throw new Error("Observaciones inválidas.");

    return {
        ...asistencia,
        horaEntrada: asistencia.horaEntrada.trim(),
        horaSalida: asistencia.horaSalida.trim(),
        observaciones: asistencia.observaciones.trim()
    };
}

export async function listarAsistencias(): Promise<Asistencia[]> {
    return leerAsistencias();
}

export async function buscarAsistencia(id: number): Promise<Asistencia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const asistencias = await leerAsistencias();
    const asistencia = asistencias.find(a => a.id === id);

    if (!asistencia)
        throw new Error("Asistencia no encontrada.");

    return asistencia;
}

export async function agregarAsistencia( asistencia: Asistencia): Promise<Asistencia> {
    if (!validarId(asistencia.id))
        throw new Error("ID inválido.");

    const asistencias = await leerAsistencias();

    if (asistencias.some(a => a.id === asistencia.id))
        throw new Error("El ID ya existe.");

    const nuevaAsistencia = validarAsistencia(asistencia);

    const asistenciaExiste = asistencias.some(
        a => a.idCliente === nuevaAsistencia.idCliente &&
            a.fecha === nuevaAsistencia.fecha && a.horaEntrada === nuevaAsistencia.horaEntrada
    );

    if (asistenciaExiste)
        throw new Error( "La asistencia del cliente ya está registrada.");

    asistencias.push(nuevaAsistencia);
    await guardarAsistencias(asistencias);

    return nuevaAsistencia;
}

export async function actualizarAsistencia( id: number, datos: Asistencia): Promise<Asistencia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const asistencias = await leerAsistencias();
    const posicion = asistencias.findIndex(a => a.id === id);

    if (posicion === -1)
        throw new Error("Asistencia no encontrada.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID de la asistencia.");

    const asistenciaActualizada = validarAsistencia(datos);

    const asistenciaExiste = asistencias.some(
        (a, indice) => indice !== posicion && a.idCliente === asistenciaActualizada.idCliente 
            && a.fecha === asistenciaActualizada.fecha &&  a.horaEntrada === asistenciaActualizada.horaEntrada
    );

    if (asistenciaExiste)
        throw new Error("La asistencia del cliente ya está registrada.");

    asistencias[posicion] = asistenciaActualizada;
    await guardarAsistencias(asistencias);

    return asistenciaActualizada;
}

export async function eliminarAsistencia( id: number): Promise<Asistencia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const asistencias = await leerAsistencias();
    const posicion = asistencias.findIndex(a => a.id === id);

    if (posicion === -1)
        throw new Error("Asistencia no encontrada.");

    const [asistenciaEliminada] = asistencias.splice(posicion, 1);

    await guardarAsistencias(asistencias);

    return asistenciaEliminada;
}