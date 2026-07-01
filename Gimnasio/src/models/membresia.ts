import {estado} from "./estado";

export interface Membresia{
    idMembresia:number;
    nombre:string;
    descripcion:string;
    plazo:number;
    precio:number;
    estado:estado;
}

