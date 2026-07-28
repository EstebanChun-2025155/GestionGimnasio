import {EstadoHabilitacion} from "./estado";

export interface Sede{
    id:number;
    nombre:string;
    direccion:string;
    telefono:string;
    estado:EstadoHabilitacion;
}

