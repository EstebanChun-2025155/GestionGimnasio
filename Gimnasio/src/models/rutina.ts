import {EstadoSeguimiento} from "./estado";

export interface Rutina{
    id:number;
    idCliente:number;
    idEntrenador:number;
    nombre:string;
    objetivo:string;
    estado:EstadoSeguimiento;
}

