import {EstadoSeguimiento} from "./estado";

export interface Rutina{
    idRutina:number;
    idCliente:number;
    idEntrenador:number;
    nombre:string;
    objetivo:string;
    estado:EstadoSeguimiento;
}

