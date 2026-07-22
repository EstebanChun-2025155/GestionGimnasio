import {readFile, writeFile} from "fs/promises"
import {Usuario} from "../models/usuario"
import { validarContrasena, asignarEstadoPersona, validarFechaIngreso, validarId, validarIdNuevo, validarRol, validarUser } from "../utils/validaciones"

const ruta = "./src/data/usuarios";

async function leerUsuarios(): Promise<Usuario[]> {
    return JSON.parse(await readFile(ruta, "utf-8"));
}

async function guardarUsuarios(usuarios: Usuario[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(usuarios, null, 2));
}

export async function listarUsuarios() {
    return leerUsuarios(); 
}

export async function buscarUsuario(id: number){
    if (!validarId(id))
        throw new Error("ID inválido.");

    const usuarios = await leerUsuarios();
    return usuarios.find(usuario => usuario.id === id);
}

export async function agregarUsuario(usuario: Usuario) {
    const usuarios = await leerUsuarios();

    if (!validarIdNuevo(usuario.id, usuarios))
        throw new Error("El ID ya existe.");

    if (!validarUser(usuario.username))
        throw new Error("Username inválido.");

    if (!validarContrasena(usuario.password))
        throw new Error("Contraseña inválida.");

    if (!validarRol(usuario.rol))
        throw new Error("Rol inválido.");

    usuario.estado = asignarEstadoPersona(usuario.estado);

    if (!validarFechaIngreso(usuario.fechaIngreso))
        throw new Error("Fecha inválida.");

    usuarios.push(usuario);

    await guardarUsuarios(usuarios);
}

export async function actualizarUsuario(id: number, datos: Usuario){
    const usuarios = await leerUsuarios();
    const posicion = usuarios.findIndex(usuario => usuario.id === id);

    if (posicion === -1)
        throw new Error("Usuario no encontrado.");  

     if (!validarIdNuevo(datos.id, usuarios))
        throw new Error("El ID ya existe.");

    if (!validarUser(datos.username))
        throw new Error("Username inválido.");

    if (!validarContrasena(datos.password))
        throw new Error("Contraseña inválida.");

    if (!validarRol(datos.rol))
        throw new Error("Rol inválido.");

    datos.estado = asignarEstadoPersona(datos.estado);

    if (!validarFechaIngreso(datos.fechaIngreso))
        throw new Error("Fecha inválida.");


    usuarios[posicion] = datos;
    await guardarUsuarios(usuarios);
}

export async function eliminarUsuario(id: number){
    const usuarios = await leerUsuarios();
    const posicion = usuarios.findIndex(usuario => usuario.id === id);  

    if (posicion === -1)
        throw new Error("Usuario no encontrado.");

    usuarios.splice(posicion, 1);
    await guardarUsuarios(usuarios);
    return true;

} 