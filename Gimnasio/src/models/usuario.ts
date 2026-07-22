import {EstadoPersona} from "./estado";
import {Rol} from "./rol";

export interface Usuario{
    idUsuario:number,
    username:string,
    password:string,
    rol:Rol,
    estado:EstadoPersona
    fechaIngreso:Date
}

