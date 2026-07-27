import { readFile, writeFile } from "fs/promises";
import { Pago } from "../models/pago";
import { asignarEstadoPago, asignarMetodoPago, validarFechaIngreso, validarId, validarMonto, validarReferencia} from "../utils/validaciones";

const ruta = "./src/data/pago.json";

async function leerPagos(): Promise<Pago[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarPagos(pagos: Pago[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(pagos, null, 2));
}

function validarPago(pago: Pago): Pago {
    if (!validarId(pago.idCliente))
        throw new Error("ID de cliente inválido.");

    if (!validarId(pago.idMembresia))
        throw new Error("ID de membresía inválido.");

    if (!validarMonto(pago.monto))
        throw new Error("Monto inválido.");

    if (!validarFechaIngreso(pago.fechaPago))
        throw new Error("Fecha de pago inválida.");

    if (!validarReferencia(pago.referencia))
        throw new Error("Referencia inválida.");

    return {
        ...pago,
        referencia: pago.referencia.trim(),
        metodoPago: asignarMetodoPago(pago.metodoPago),
        estadoPago: asignarEstadoPago(pago.estadoPago)
    };
}

export async function listarPagos(): Promise<Pago[]> {
    return leerPagos();
}

export async function buscarPago(id: number): Promise<Pago> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const pagos = await leerPagos();
    const pago = pagos.find(p => p.id === id);

    if (!pago)
        throw new Error("Pago no encontrado.");

    return pago;
}

export async function agregarPago(pago: Pago): Promise<Pago> {
    if (!validarId(pago.id))
        throw new Error("ID inválido.");

    const pagos = await leerPagos();

    if (pagos.some(p => p.id === pago.id))
        throw new Error("El ID ya existe.");

    const nuevoPago = validarPago(pago);

    if (pagos.some( p => p.referencia.toLowerCase() === nuevoPago.referencia.toLowerCase()))
        throw new Error("La referencia del pago ya existe.");

    pagos.push(nuevoPago);
    await guardarPagos(pagos);

    return nuevoPago;
}

export async function actualizarPago( id: number, datos: Pago): Promise<Pago> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const pagos = await leerPagos();
    const posicion = pagos.findIndex(p => p.id === id);

    if (posicion === -1)
        throw new Error("Pago no encontrado.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID del pago.");

    const pagoActualizado = validarPago(datos);

    const referenciaExiste = pagos.some(
         (p, indice) => indice !== posicion && p.referencia.toLowerCase() === pagoActualizado.referencia.toLowerCase()
    );

    if (referenciaExiste)
        throw new Error("La referencia del pago ya existe.");

    pagos[posicion] = pagoActualizado;
    await guardarPagos(pagos);

    return pagoActualizado;
}

export async function eliminarPago(id: number): Promise<Pago> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const pagos = await leerPagos();
    const posicion = pagos.findIndex(p => p.id === id);

    if (posicion === -1)
        throw new Error("Pago no encontrado.");

    const [pagoEliminado] = pagos.splice(posicion, 1);
    await guardarPagos(pagos);

    return pagoEliminado;
}