import {readFile, writeFile} from "fs/promises"
import {Usuario} from "../models/usuario"
import { validarContrasena, asignarEstadoPersona, validarFechaIngreso, validarId, validarIdNuevo, validarRol, validarUser, asignarRol } from "../utils/validaciones"

const ruta = "./src/data/usuario.json";

async function leerUsuarios(): Promise<Usuario[]> {
    return JSON.parse(await readFile(ruta, "utf-8"));
}

async function guardarUsuarios(usuarios: Usuario[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(usuarios, null, 2));
}

function validarUsuario(usuario: Usuario): Usuario {
    if (!validarUser(usuario.username))
        throw new Error("Username inválido.");

    if (!validarContrasena(usuario.password))
        throw new Error("Contraseña inválida.");

    if (!validarRol(usuario.rol))
        throw new Error("Rol inválido.");

    if (!validarFechaIngreso(usuario.fechaIngreso))
        throw new Error("Fecha de ingreso inválida.");

    return {
        ...usuario,
        username: usuario.username.trim(),
        rol: asignarRol(usuario.rol),
        estado: asignarEstadoPersona(usuario.estado)
    };
}

export async function listarUsuarios(): Promise<Usuario[]> {
    return leerUsuarios(); 
}

export async function buscarUsuario(id: number): Promise<Usuario>{
    if (!validarId(id))
        throw new Error("ID inválido.");

    const usuarios = await leerUsuarios();
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario)
        throw new Error("Usuario no encontrado.");

    return usuario;
}

export async function agregarUsuario(usuario: Usuario): Promise<Usuario> {
    if (!validarId(usuario.id))
    throw new Error("ID inválido.");

    const usuarios = await leerUsuarios();

    const idExiste = usuarios.some( m => m.id === usuario.id);

    if (idExiste)
        throw new Error("El ID ya existe.");

    const nuevoUsuario = validarUsuario(usuario);

    const usernameExiste = usuarios.some(
        u => u.username.toLowerCase() === nuevoUsuario.username.toLowerCase()
    );

    if (usernameExiste)
         throw new Error("Este User ya existe.");

    usuarios.push(nuevoUsuario);
    await guardarUsuarios(usuarios);

    return nuevoUsuario;
}

export async function actualizarUsuario(id: number, datos: Usuario): Promise<Usuario> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const usuarios = await leerUsuarios();
    const posicion = usuarios.findIndex(u => u.id === id);

    if (posicion === -1)
        throw new Error("Usuario no encontrado.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID del usuario.");

    const usuarioActualizado = validarUsuario(datos);

    const userExiste = usuarios.some(
        (u, indice) => indice !== posicion && u.username.toLowerCase() === usuarioActualizado.username.toLowerCase()
    );

    if (userExiste)
        throw new Error("Este User ya existe.");

    usuarios[posicion] = usuarioActualizado;
    await guardarUsuarios(usuarios);

    return usuarioActualizado;
}

export async function eliminarUsuario(id: number): Promise<Usuario>{
    if (!validarId(id))
        throw new Error("ID inválido.");

    const usuarios = await leerUsuarios();
    const posicion = usuarios.findIndex(u => u.id === id);

    if (posicion === -1)
        throw new Error("Usuario no encontrado.");

    const [usuarioEliminado] = usuarios.splice(posicion, 1);
    await guardarUsuarios(usuarios);

    return usuarioEliminado;
} 