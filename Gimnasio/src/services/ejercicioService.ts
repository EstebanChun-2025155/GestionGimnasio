import { readFile, writeFile } from "fs/promises";
import { Ejercicio } from "../models/ejercicio";
import { validarDescanso, validarGrupoMuscular, validarId, validarInstrucciones, validarNombre, validarRepeticiones, validarSeries} from "../utils/validaciones";

const ruta = "./src/data/ejercicio.json";

async function leerEjercicios(): Promise<Ejercicio[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarEjercicios( ejercicios: Ejercicio[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(ejercicios, null, 2));
}

function validarEjercicio(ejercicio: Ejercicio): Ejercicio {
    if (!validarId(ejercicio.idRutina))
        throw new Error("ID de rutina inválido.");

    if (!validarNombre(ejercicio.nombre))
        throw new Error("Nombre de ejercicio inválido.");

    if (!validarGrupoMuscular(ejercicio.grupoMuscular))
        throw new Error("Grupo muscular inválido.");

    if (!validarSeries(ejercicio.series))
        throw new Error("Cantidad de series inválida.");

    if (!validarRepeticiones(ejercicio.repeticiones))
        throw new Error("Cantidad de repeticiones inválida.");

    if (!validarDescanso(ejercicio.descanso))
        throw new Error("Tiempo de descanso inválido.");

    if (!validarInstrucciones(ejercicio.instrucciones))
        throw new Error("Instrucciones inválidas.");

    return {
        ...ejercicio,
        nombre: ejercicio.nombre.trim(),
        grupoMuscular: ejercicio.grupoMuscular.trim(),
        instrucciones: ejercicio.instrucciones.trim()
    };
}

export async function listarEjercicios(): Promise<Ejercicio[]> {
    return leerEjercicios();
}

export async function buscarEjercicio( id: number): Promise<Ejercicio> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const ejercicios = await leerEjercicios();
    const ejercicio = ejercicios.find(e => e.id === id);

    if (!ejercicio)
        throw new Error("Ejercicio no encontrado.");

    return ejercicio;
}

export async function agregarEjercicio( ejercicio: Ejercicio): Promise<Ejercicio> {
    if (!validarId(ejercicio.id))
        throw new Error("ID inválido.");

    const ejercicios = await leerEjercicios();

    if (ejercicios.some(e => e.id === ejercicio.id))
        throw new Error("El ID ya existe.");

    const nuevoEjercicio = validarEjercicio(ejercicio);

    const ejercicioExiste = ejercicios.some(e => e.idRutina === nuevoEjercicio.idRutina &&  
        e.nombre.toLowerCase() === nuevoEjercicio.nombre.toLowerCase()
    );

    if (ejercicioExiste)
        throw new Error("La rutina ya contiene un ejercicio con ese nombre.");

    ejercicios.push(nuevoEjercicio);
    await guardarEjercicios(ejercicios);

    return nuevoEjercicio;
}

export async function actualizarEjercicio( id: number, datos: Ejercicio): Promise<Ejercicio> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const ejercicios = await leerEjercicios();
    const posicion = ejercicios.findIndex(e => e.id === id);

    if (posicion === -1)
        throw new Error("Ejercicio no encontrado.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID del ejercicio.");

    const ejercicioActualizado = validarEjercicio(datos);

    const ejercicioExiste = ejercicios.some(
        (e, indice) => indice !== posicion && e.idRutina === ejercicioActualizado.idRutina && 
            e.nombre.toLowerCase() === ejercicioActualizado.nombre.toLowerCase()
    );

    if (ejercicioExiste)
        throw new Error("Este ejercicio ya esta registrado");

    ejercicios[posicion] = ejercicioActualizado;
    await guardarEjercicios(ejercicios);

    return ejercicioActualizado;
}

export async function eliminarEjercicio(id: number): Promise<Ejercicio> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const ejercicios = await leerEjercicios();
    const posicion = ejercicios.findIndex(e => e.id === id);

    if (posicion === -1)
        throw new Error("Ejercicio no encontrado.");

    const [ejercicioEliminado] = ejercicios.splice(posicion, 1);

    await guardarEjercicios(ejercicios);

    return ejercicioEliminado;
}