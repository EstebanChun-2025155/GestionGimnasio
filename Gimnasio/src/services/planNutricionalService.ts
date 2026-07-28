import { readFile, writeFile } from "fs/promises";
import { PlanNutricional } from "../models/planNutricional";
import { asignarEstadoSeguimiento, validarId, validarInstrucciones, validarPlanNutricional, validarPlazo} from "../utils/validaciones";

const ruta = "./src/data/planNutricional.json";

async function leerPlanesNutricionales(): Promise<PlanNutricional[]> {
    const contenido = await readFile(ruta, "utf-8");
    return JSON.parse(contenido);
}

async function guardarPlanesNutricionales( planes: PlanNutricional[]): Promise<void> {
    await writeFile(ruta, JSON.stringify(planes, null, 2));
}

function validarCalorias(calorias: string): boolean {
    return /^\d{3,5}\s?kcal$/i.test(calorias.trim());
}

function validarDatosPlan(plan: PlanNutricional): PlanNutricional {
    if (!validarId(plan.idCliente))
        throw new Error("ID de cliente inválido.");

    if (!validarId(plan.idEntrenador))
        throw new Error("ID de entrenador inválido.");

    if (!validarPlanNutricional(plan.objetivo))
        throw new Error("Objetivo inválido.");

    if (!validarCalorias(plan.calorias))
        throw new Error( "Las calorías deben tener un formato como: 2200 kcal.");

    if (!validarInstrucciones(plan.indicaciones))
        throw new Error("Indicaciones inválidas.");

    if (!validarPlazo(plan.plazo))
        throw new Error("El plazo debe estar entre 1 y 12 meses.");

    return {
        ...plan,
        objetivo: plan.objetivo.trim(),
        calorias: plan.calorias.trim().toLowerCase(),
        indicaciones: plan.indicaciones.trim(),
        estado: asignarEstadoSeguimiento(plan.estado)
    };
}

export async function listarPlanesNutricionales():
    Promise<PlanNutricional[]> {
    return leerPlanesNutricionales();
}

export async function buscarPlanNutricional( id: number): Promise<PlanNutricional> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const planes = await leerPlanesNutricionales();
    const plan = planes.find(p => p.id === id);

    if (!plan)
        throw new Error("Plan nutricional no encontrado.");

    return plan;
}

export async function agregarPlanNutricional( plan: PlanNutricional): Promise<PlanNutricional> {
    if (!validarId(plan.id))
        throw new Error("ID inválido.");

    const planes = await leerPlanesNutricionales();

    if (planes.some(p => p.id === plan.id))
        throw new Error("El ID ya existe.");

    const nuevoPlan = validarDatosPlan(plan);

    const planActivoExiste = planes.some(
        p => p.idCliente === nuevoPlan.idCliente && p.estado === "activa"
    );

    if (planActivoExiste && nuevoPlan.estado === "activa")
        throw new Error("El cliente ya tiene un plan nutricional activo.");

    planes.push(nuevoPlan);
    await guardarPlanesNutricionales(planes);

    return nuevoPlan;
}

export async function actualizarPlanNutricional(id: number, datos: PlanNutricional): Promise<PlanNutricional> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const planes = await leerPlanesNutricionales();
    const posicion = planes.findIndex(p => p.id === id);

    if (posicion === -1)
        throw new Error("Plan nutricional no encontrado.");

    if (datos.id !== id)
        throw new Error("No se puede modificar el ID del plan nutricional.");

    const planActualizado = validarDatosPlan(datos);

    const planActivoExiste = planes.some(
        (p, indice) => indice !== posicion &&
            p.idCliente === planActualizado.idCliente && p.estado === "activa"
    );

    if (planActivoExiste && planActualizado.estado === "activa")
        throw new Error("El cliente ya tiene otro plan nutricional activo.");

    planes[posicion] = planActualizado;
    await guardarPlanesNutricionales(planes);

    return planActualizado;
}

export async function eliminarPlanNutricional(id: number): Promise<PlanNutricional> {
    if (!validarId(id))
        throw new Error("ID inválido.");

    const planes = await leerPlanesNutricionales();
    const posicion = planes.findIndex(p => p.id === id);

    if (posicion === -1)
        throw new Error("Plan nutricional no encontrado.");

    const [planEliminado] = planes.splice(posicion, 1);
    await guardarPlanesNutricionales(planes);

    return planEliminado;
}