import {EstadoSeguimiento} from "./estado";

export interface PlanNutricional{
    id:number;
    idCliente:number;
    idEntrenador:number;
    objetivo:string;
    calorias:string;
    indicaciones:string;
    plazo:number;
    estado:EstadoSeguimiento;
}

