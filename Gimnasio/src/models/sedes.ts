export interface Sedes{
    idSede:number;
    nombre:string;
    direccion:string;
    telefono:number;
    estado:Estado;
}

export type Estado = "Activa"|"Inactiva";
