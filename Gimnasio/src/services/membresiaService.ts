import { readFile, writeFile } from "fs/promises";
import { Membresia } from "../models/membresia";
import { asignarEstadoHabilitacion, validarDescripcion, validarId, validarNombre, validarPlazo, validarPrecio} from "../utils/validaciones";

const ruta = "./src/data/membresia.json";

async function leerMembresias(): Promise<Membresia[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}       

async function guardarMembresias( membresias: Membresia[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(membresias, null, 2));
}

function validarMembresia(membresia: Membresia): Membresia {
    if (!validarNombre(membresia.nombre))
        throw new Error("Nombre de membresía inválido.");

    if (!validarDescripcion(membresia.descripcion))
        throw new Error("Descripción inválida.");

    if (!validarPlazo(membresia.plazo))
        throw new Error("El plazo debe estar entre 1 y 12 meses.");

    if (!validarPrecio(membresia.precio))
        throw new Error("El precio debe ser mayor que cero.");

    return {
        ...membresia,
        nombre: membresia.nombre.trim(),
        descripcion: membresia.descripcion.trim(),
        estado: asignarEstadoHabilitacion(membresia.estado)
    };
}

export async function listarMembresias(): Promise<Membresia[]> {
    return leerMembresias();
}

export async function buscarMembresia(id: number): Promise<Membresia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const membresias = await leerMembresias();
    const membresia = membresias.find(m => m.id === id);

    if (!membresia)
        throw new Error("Membresía no encontrada.");

    return membresia;
}

export async function agregarMembresia( membresia: Membresia): Promise<Membresia> {
    if (!validarId(membresia.id))
        throw new Error("ID inválido.");

    const membresias = await leerMembresias();

    const idExiste = membresias.some( m => m.id === membresia.id);

    if (idExiste)
        throw new Error("El ID ya existe.");

    const nuevaMembresia = validarMembresia(membresia);

    const nombreExiste = membresias.some(
        m => m.nombre.toLowerCase() ===  nuevaMembresia.nombre.toLowerCase()
    );

    if (nombreExiste)
        throw new Error("Ya existe una membresía con ese nombre.");

    membresias.push(nuevaMembresia);
    await guardarMembresias(membresias);

    return nuevaMembresia;
}

export async function actualizarMembresia(id: number, datos: Membresia): Promise<Membresia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const membresias = await leerMembresias();
    const posicion = membresias.findIndex( m => m.id === id);

    if (posicion === -1)
        throw new Error("Membresía no encontrada.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID de la membresía.");

    const membresiaActualizada = validarMembresia(datos);

    const membresiaExiste = membresias.some(
        (m, indice) => indice !== posicion && m.nombre.toLowerCase() === membresiaActualizada.nombre.toLowerCase()
    );

    if (membresiaExiste)
        throw new Error( "Ya existe una membresía con este nombre.");

    membresias[posicion] = membresiaActualizada;
    await guardarMembresias(membresias);

    return membresiaActualizada;
}

export async function eliminarMembresia(id: number): Promise<Membresia> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const membresias = await leerMembresias();
    const posicion = membresias.findIndex( m => m.id === id);

    if (posicion === -1)
        throw new Error("Membresía no encontrada.");

    const [membresiaEliminada] = membresias.splice( posicion,1);
    await guardarMembresias(membresias);

    return membresiaEliminada;
}