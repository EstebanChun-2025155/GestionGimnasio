import { readFile, writeFile } from "fs/promises";
import { Cliente } from "../models/cliente";
import { asignarEstadoPersona, validarApellido, validarCorreo, validarDpi, validarFechaIngreso, validarId, validarNombre, validarTelefono} from "../utils/validaciones";

const ruta = "./src/data/cliente.json";

async function leerClientes(): Promise<Cliente[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarClientes(clientes: Cliente[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(clientes, null, 2));
}

function validarCliente(cliente: Cliente): Cliente {
    if (!validarId(cliente.idUsuario))
        throw new Error("ID de usuario inválido.");

    if (!validarId(cliente.idSede))
        throw new Error("ID de sede inválido.");

    if (!validarId(cliente.idMembresia))
        throw new Error("ID de membresía inválido.");

    if (!validarNombre(cliente.nombre))
        throw new Error("Nombre inválido.");

    if (!validarApellido(cliente.apellido))
        throw new Error("Apellido inválido.");

    if (!validarDpi(cliente.dpi))
        throw new Error("DPI inválido.");

    if (!validarTelefono(cliente.telefono))
        throw new Error("Teléfono inválido.");

    if (!validarCorreo(cliente.correo))
        throw new Error("Correo inválido.");

    if (!validarFechaIngreso(cliente.fecha))
        throw new Error("Fecha inválida.");

    return {
        ...cliente,
        nombre: cliente.nombre.trim(),
        apellido: cliente.apellido.trim(),
        dpi: cliente.dpi.trim(),
        telefono: cliente.telefono.trim(),
        correo: cliente.correo.trim().toLowerCase(),
        estado: asignarEstadoPersona(cliente.estado)
    };
}

export async function listarClientes(): Promise<Cliente[]> {
    return leerClientes();
}

export async function buscarCliente(id: number): Promise<Cliente> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const clientes = await leerClientes();
    const cliente = clientes.find(c => c.id === id);

    if (!cliente)
        throw new Error("Cliente no encontrado.");

    return cliente;
}

export async function agregarCliente(cliente: Cliente): Promise<Cliente> {
    if (!validarId(cliente.id))
        throw new Error("ID inválido.");

    const clientes = await leerClientes();

    if (clientes.some(c => c.id === cliente.id))
        throw new Error("El ID ya existe.");

    const nuevoCliente = validarCliente(cliente);

    if (clientes.some(c => c.idUsuario === nuevoCliente.idUsuario))
        throw new Error("El usuario ya pertenece a un cliente.");

    if (clientes.some(c => c.dpi === nuevoCliente.dpi))
        throw new Error("El DPI ya pertenece a otro cliente.");

    if (clientes.some(c => c.correo.toLowerCase() === nuevoCliente.correo))
         throw new Error("El correo ya pertenece a otro cliente.");

    clientes.push(nuevoCliente);
    await guardarClientes(clientes);

    return nuevoCliente;
}

export async function actualizarCliente( id: number, datos: Cliente): Promise<Cliente> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const clientes = await leerClientes();
    const posicion = clientes.findIndex(c => c.id === id);

    if (posicion === -1)
        throw new Error("Cliente no encontrado.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID del cliente.");

    const clienteActualizado = validarCliente(datos);

    const usuarioExiste = clientes.some(
        (c, indice) => indice !== posicion && c.idUsuario === clienteActualizado.idUsuario
    );

    if (usuarioExiste)
        throw new Error("El usuario ya pertenece a otro cliente.");

    const dpiExiste = clientes.some(
        (c, indice) => indice !== posicion && c.dpi === clienteActualizado.dpi
    );

    if (dpiExiste)
        throw new Error("El DPI ya pertenece a otro cliente.");

    const correoExiste = clientes.some(
        (c, indice) => indice !== posicion &&  c.correo.toLowerCase() === clienteActualizado.correo
    );

    if (correoExiste)
        throw new Error("El correo ya pertenece a otro cliente.");

    clientes[posicion] = clienteActualizado;
    await guardarClientes(clientes);

    return clienteActualizado;
}

export async function eliminarCliente(id: number): Promise<Cliente> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const clientes = await leerClientes();
    const posicion = clientes.findIndex(c => c.id === id);

    if (posicion === -1)
        throw new Error("Cliente no encontrado.");

    const [clienteEliminado] = clientes.splice(posicion, 1);
    await guardarClientes(clientes);

    return clienteEliminado;
}