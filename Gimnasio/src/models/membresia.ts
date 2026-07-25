import {EstadoHabilitacion} from "./estado";

export interface Membresia{
    id:number;
    nombre:string;
    descripcion:string;
    plazo:number;
    precio:number;
    estado:EstadoHabilitacion;
}

