import {EstadoPersona} from "./estado";

export interface Cliente{
    id:number;
    idUsuario: number;
    idSede: number;
    idMembresia:number;
    nombre:string;
    apellido:string;
    dpi:string;
    telefono:string;
    correo:string;
    fecha:string;
    estado:EstadoPersona;
}
