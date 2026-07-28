import {EstadoPersona} from "./estado";
import {Rol} from "./rol";

export interface Usuario{
    id:number,
    username:string,
    password:string,
    rol:Rol,
    estado:EstadoPersona
    fechaIngreso:string
}

