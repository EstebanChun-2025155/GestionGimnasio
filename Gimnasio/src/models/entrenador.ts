import {Estado} from "./estado";

export interface Entrenador{
    idEntrenador:number;
    idUsuario:number;
    idSede:number;
    nombre:string;
    apellido:string;
    dpi:number;
    telefono:number;
    especialidad:string;
    estado:Estado
}
