export interface Membresia{
    idMembresia:number;
    nombre:string;
    descripcion:string;
    plazo:number;
    precio:number;
    estado:Estado;
}

export type Estado = "activa"|"inactiva";