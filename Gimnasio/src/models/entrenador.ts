import {EstadoPersona} from "./estado";

export interface Entrenador{
    id:number;
    idUsuario:number;
    idSede:number;
    nombre:string;
    apellido:string;
    dpi:string;
    telefono:string;
    especialidad:string;
    estado:EstadoPersona
}
