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

export type Estado = "Activo"|"Inactivo";