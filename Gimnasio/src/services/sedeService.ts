import { readFile, writeFile } from "fs/promises";
import { Sede } from "../models/sede";
import { asignarEstadoHabilitacion, validarDireccion, validarId, validarNombre, validarTelefono} from "../utils/validaciones";

const ruta = "./src/data/sedes.json";

async function leerSedes(): Promise<Sede[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarSedes(sedes: Sede[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(sedes, null, 2));
}

function validarSede(sede: Sede): Sede {
    if (!validarNombre(sede.nombre))
        throw new Error("Nombre de sede inválido.");

    if (!validarDireccion(sede.direccion))
        throw new Error("Dirección inválida.");

    if (!validarTelefono(sede.telefono))
        throw new Error("Teléfono inválido.");

    return {
        ...sede,
        nombre: sede.nombre.trim(),
        direccion: sede.direccion.trim(),
        telefono: sede.telefono.trim(),
        estado: asignarEstadoHabilitacion(sede.estado)
    };
}

export async function listarSedes(): Promise<Sede[]> {
    return leerSedes();
}

export async function buscarSede(id: number): Promise<Sede> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const sedes = await leerSedes();
    const sede = sedes.find(s => s.id === id);

    if (!sede)
        throw new Error("Sede no encontrada.");

    return sede;
}

export async function agregarSede(sede: Sede): Promise<Sede> {
    if (!validarId(sede.id))
        throw new Error("ID inválido.");

    const sedes = await leerSedes();

    if (sedes.some(s => s.id === sede.id))
        throw new Error("El ID ya existe.");

    const nuevaSede = validarSede(sede);

    const nombreExiste = sedes.some(
        s => s.nombre.toLowerCase() === nuevaSede.nombre.toLowerCase()
    );

    if (nombreExiste)
        throw new Error("Ya existe una sede con ese nombre.");

    const telefonoExiste = sedes.some(
        s => s.telefono === nuevaSede.telefono
    );

    if (telefonoExiste)
        throw new Error("El teléfono ya pertenece a otra sede.");

    sedes.push(nuevaSede);
    await guardarSedes(sedes);

    return nuevaSede;
}

export async function actualizarSede( id: number, datos: Sede): Promise<Sede> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const sedes = await leerSedes();
    const posicion = sedes.findIndex(s => s.id === id);

    if (posicion === -1)
        throw new Error("Sede no encontrada.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID de la sede.");

    const sedeActualizada = validarSede(datos);

    const nombreExiste = sedes.some(
        (s, indice) => indice !== posicion && s.nombre.toLowerCase() === sedeActualizada.nombre.toLowerCase()
    );

    if (nombreExiste)
        throw new Error("Ya existe una sede con ese nombre.");

    const telefonoExiste = sedes.some(
        (s, indice) => indice !== posicion && s.telefono === sedeActualizada.telefono
    );

    if (telefonoExiste)
        throw new Error("El teléfono ya pertenece a otra sede.");

    sedes[posicion] = sedeActualizada;
    await guardarSedes(sedes);

    return sedeActualizada;
}

export async function eliminarSede(id: number): Promise<Sede> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const sedes = await leerSedes();
    const posicion = sedes.findIndex(s => s.id === id);

    if (posicion === -1)
        throw new Error("Sede no encontrada.");

    const [sedeEliminada] = sedes.splice(posicion, 1);

    await guardarSedes(sedes);

    return sedeEliminada;
}