import {Estado} from "./estado";

export interface Cliente{
    idCliente:number;
    idUsuario: number;
    idSede: number;
    idMembresia:number;
    nombre:string;
    apellido:string;
    dpi:number;
    telefono:number;
    correo:string;
    fecha:Date;
    estado:Estado;
}
