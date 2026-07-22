import { EstadoHabilitacion, EstadoPersona, EstadoSeguimiento } from "../models/estado";
import { Rol } from "../models/rol";
import { MetodoPago } from "../models/metodoPago";
import { EstadoPago } from "../models/estadoPago";

interface ConId {
    id: number;
}

// Validaciones generales

function validarTexto(
    texto: string,
    minimo: number,
    maximo: number
): boolean {
    const valor = texto.trim();
    return valor.length >= minimo && valor.length <= maximo;
}

function validarNumeroPositivo(numero: number): boolean {
    return Number.isFinite(numero) && numero > 0;
}

function validarEnteroPositivo(numero: number): boolean {
    return Number.isInteger(numero) && numero > 0;
}

export function validarId(id: number): boolean {
    return validarEnteroPositivo(id);
}

export function existeId(id: number, registros: ConId[]): boolean {
    return registros.some(registro => registro.id === id);
}

export function validarIdNuevo(id: number, registros: ConId[]): boolean {
    return validarId(id) && !existeId(id, registros);
}

export function validarNombre(nombre: string): boolean {
    return validarTexto(nombre, 2, 60);
}

export function validarApellido(apellido: string): boolean {
    return validarTexto(apellido, 2, 50);
}

export function validarTelefono(telefono: string): boolean {
    return /^\d{8}$/.test(telefono.trim());
}

export function validarDireccion(direccion: string): boolean {
    return validarTexto(direccion, 5, 150);
}

export function asignarEstadoPersona(estado: string): EstadoPersona {
    const valor = estado.trim().toLowerCase();

    if (valor === "activo") return "Activo";
    if (valor === "inactivo") return "Inactivo";

    throw new Error(
        "Estado incorrecto. Solo se permite: activo o inactivo"
    );
}

export function asignarEstadoHabilitacion(estado: string): EstadoHabilitacion {
    const valor = estado.trim().toLowerCase();

    if (valor === "activa") return "activa";
    if (valor === "inactiva") return "inactiva";

    throw new Error(
        "Estado incorrecto. Solo se permite: activa o inactiva"
    );
}

export function asignarEstadoSeguimiento(estado: string): EstadoSeguimiento {
    const valor = estado.trim().toLowerCase();

    if (valor === "activa") return "activa";
    if (valor === "finalizada") return "finalizada";

    throw new Error(
        "Estado incorrecto. Solo se permite: activa o finalizada"
    );
}

export function validarEstadoPersona(estado: string): boolean {
    const valor = estado.trim().toLowerCase();

    return valor === "activo" || valor === "inactivo";
}

export function validarEstadoHabilitacion(estado: string): boolean {
    const valor = estado.trim().toLowerCase();

    return valor === "activa" || valor === "inactiva";
}

export function validarEstadoSeguimiento(estado: string): boolean {
    const valor = estado.trim().toLowerCase();

    return valor === "activa" || valor === "finalizada";
}

export function validarFechaIngreso(fecha: Date): boolean {
    const fechaMinima = new Date("2000-01-01");
    const fechaActual = new Date();

    return (
        fecha instanceof Date &&
        !Number.isNaN(fecha.getTime()) &&
        fecha >= fechaMinima &&
        fecha <= fechaActual
    );
}

// Usuario
export function validarUser(username: string): boolean {
    return validarTexto(username, 3, 50);
}

export function validarContrasena(password: string): boolean {
    return password.trim().length >= 8;
}

export function validarRol(rol: string): boolean {
    const valor = rol.trim().toLowerCase();
    return Object.values(Rol).includes(valor as Rol);
}

export function asignarRol(tipo: string): Rol {
    const valor = tipo.trim().toLowerCase();

    if (valor === "admin") return Rol.ADMIN;
    if (valor === "cliente") return Rol.CLIENTE;
    if (valor === "entrenador") return Rol.ENTRENADOR;

    throw new Error(
        "Rol incorrecto. Solo se permite: admin, cliente o entrenador"
    );
}

// Membresía
export function validarDescripcion(descripcion: string): boolean {
    return validarTexto(descripcion, 10, 100);
}

export function validarPlazo(plazo: number): boolean {
    return Number.isInteger(plazo) && plazo >= 1 && plazo <= 12;
}

export function validarPrecio(precio: number): boolean {
    return validarNumeroPositivo(precio);
}

// Entrenador
export function validarDpi(dpi: string): boolean {
    return /^\d{13}$/.test(dpi.trim());
}

export function validarEspecialidad(especialidad: string): boolean {
    return validarTexto(especialidad, 3, 50);
}

// Cliente
export function validarCorreo(correo: string): boolean {
    const valor = correo.trim().toLowerCase();

    return /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/.test(valor);
}

// Pago
export function validarMonto(monto: number): boolean {
    return validarNumeroPositivo(monto);
}

export function validarFechaPago(fechaPago: Date): boolean {
    if (
        !(fechaPago instanceof Date) ||
        Number.isNaN(fechaPago.getTime())
    ) {
        return false;
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const fechaValidada = new Date(fechaPago);
    fechaValidada.setHours(0, 0, 0, 0);

    return fechaValidada >= fechaActual;
}

export function validarReferencia(referencia: string): boolean {
    return validarTexto(referencia, 5, 100);
}

export function asignarMetodoPago(metodoPago: string): MetodoPago {
    const valor = metodoPago.trim().toLowerCase();

    if (valor === "tarjeta") return MetodoPago.TARJETA;
    if (valor === "transferencia") {
        return MetodoPago.TRANSFERENCIA;
    }

    throw new Error(
        "Método de pago incorrecto. Solo se permite: tarjeta o transferencia"
    );
}

export function asignarEstadoPago(estadoPago: string): EstadoPago {
    const valor = estadoPago.trim().toLowerCase();

    if (valor === "pagado") return EstadoPago.PAGADO;
    if (valor === "pendiente") return EstadoPago.PENDIENTE;
    if (valor === "vencido") return EstadoPago.VENCIDO;

    throw new Error(
        "Estado de pago incorrecto. Solo se permite: pagado, pendiente o vencido"
    );
}

// Rutina
export function validarObjetivo(objetivo: string): boolean {
    return validarTexto(objetivo, 10, 100);
}

// Ejercicio
export function validarGrupoMuscular(grupo: string): boolean {
    return validarTexto(grupo, 2, 50);
}

export function validarSeries(series: number): boolean {
    return validarEnteroPositivo(series);
}

export function validarRepeticiones(repeticiones: number): boolean {
    return validarEnteroPositivo(repeticiones);
}

export function validarDescanso(descanso: number): boolean {
    return validarEnteroPositivo(descanso);
}

export function validarInstrucciones(instrucciones: string): boolean {
    return validarTexto(instrucciones, 10, 150);
}

// Asistencia
export function validarObservaciones(observaciones: string): boolean {
    return observaciones.trim().length <= 100;
}

// Plan nutricional
export function validarPlanNutricional(objetivo: string): boolean {
    return validarTexto(objetivo, 10, 100);
}