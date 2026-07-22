import {EstadoPersona} from "./estado";

export interface Entrenador{
    idEntrenador:number;
    idUsuario:number;
    idSede:number;
    nombre:string;
    apellido:string;
    dpi:string;
    telefono:number;
    especialidad:string;
    estado:EstadoPersona
}
