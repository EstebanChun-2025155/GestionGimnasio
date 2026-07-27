import { readFile, writeFile } from "fs/promises";
import { Entrenador } from "../models/entrenador";
import { asignarEstadoPersona, validarApellido, validarDpi, validarEspecialidad, validarId, validarNombre, validarTelefono} from "../utils/validaciones";

const ruta = "./src/data/entrenador.json";

async function leerEntrenadores(): Promise<Entrenador[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarEntrenadores( entrenadores: Entrenador[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(entrenadores, null, 2));
}

function validarEntrenador( entrenador: Entrenador): Entrenador {
    if (!validarId(entrenador.idUsuario))
        throw new Error("ID de usuario inválido.");

    if (!validarId(entrenador.idSede))
        throw new Error("ID de sede inválido.");

    if (!validarNombre(entrenador.nombre))
        throw new Error("Nombre inválido.");

    if (!validarApellido(entrenador.apellido))
        throw new Error("Apellido inválido.");

    if (!validarDpi(entrenador.dpi))
        throw new Error("DPI inválido.");

    if (!validarTelefono(entrenador.telefono))
        throw new Error("Teléfono inválido.");

    if (!validarEspecialidad(entrenador.especialidad))
        throw new Error("Especialidad inválida.");

    return {
        ...entrenador,
        nombre: entrenador.nombre.trim(),
        apellido: entrenador.apellido.trim(),
        dpi: entrenador.dpi.trim(),
        telefono: entrenador.telefono.trim(),
        especialidad: entrenador.especialidad.trim(),
        estado: asignarEstadoPersona(entrenador.estado)
    };
}

export async function listarEntrenadores(): Promise<Entrenador[]> {
    return leerEntrenadores();
}

export async function buscarEntrenador(id: number): Promise<Entrenador> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const entrenadores = await leerEntrenadores();
    const entrenador = entrenadores.find(e => e.id === id);

    if (!entrenador)
        throw new Error("Entrenador no encontrado.");

    return entrenador;
}

export async function agregarEntrenador( entrenador: Entrenador): Promise<Entrenador> {
    if (!validarId(entrenador.id))
        throw new Error("ID inválido.");

    const entrenadores = await leerEntrenadores();

    if (entrenadores.some(e => e.id === entrenador.id))
        throw new Error("El ID ya existe.");

    const nuevoEntrenador = validarEntrenador(entrenador);

    if (entrenadores.some(e => e.idUsuario === nuevoEntrenador.idUsuario))
        throw new Error("El usuario ya pertenece a un entrenador.");

    if (entrenadores.some(e => e.dpi === nuevoEntrenador.dpi))
        throw new Error("El DPI ya pertenece a otro entrenador.");

    entrenadores.push(nuevoEntrenador);
    await guardarEntrenadores(entrenadores);

    return nuevoEntrenador;
}

export async function actualizarEntrenador(id: number,  datos: Entrenador): Promise<Entrenador> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const entrenadores = await leerEntrenadores();
    const posicion = entrenadores.findIndex(e => e.id === id);

    if (posicion === -1)
        throw new Error("Entrenador no encontrado.");

    if (datos.id !== id)
        throw new Error(
            "No se puede modificar el ID del entrenador."
        );

    const entrenadorActualizado = validarEntrenador(datos);

    const usuarioExiste = entrenadores.some(
        (e, indice) => indice !== posicion && e.idUsuario === entrenadorActualizado.idUsuario
    );

    if (usuarioExiste)
        throw new Error("El usuario ya pertenece a otro entrenador.");

    const dpiExiste = entrenadores.some(
        (e, indice) => indice !== posicion && e.dpi === entrenadorActualizado.dpi
    );

    if (dpiExiste)
        throw new Error("El DPI ya pertenece a otro entrenador.");

    entrenadores[posicion] = entrenadorActualizado;
    await guardarEntrenadores(entrenadores);

    return entrenadorActualizado;
}

export async function eliminarEntrenador( id: number): Promise<Entrenador> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const entrenadores = await leerEntrenadores();
    const posicion = entrenadores.findIndex(e => e.id === id);

    if (posicion === -1)
        throw new Error("Entrenador no encontrado.");

    const [entrenadorEliminado] = entrenadores.splice( posicion, 1);

    await guardarEntrenadores(entrenadores);

    return entrenadorEliminado;
}