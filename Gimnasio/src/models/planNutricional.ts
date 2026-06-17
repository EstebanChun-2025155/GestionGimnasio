export interface PlanNutricional{
    idPlanNutricional:number;
    idCliente:number;
    idEntrenador:number;
    objetivo:string;
    calorias:string;
    indicaciones:string;
    plazo:number;
    estado:Estado;
}

export type Estado = "En proceso"|"Finalizada";