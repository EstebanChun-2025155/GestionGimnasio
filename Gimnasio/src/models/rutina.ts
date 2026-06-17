export interface Rutina{
    idRutina:number;
    idCliente:number;
    idEntrenador:number;
    nombre:string;
    objetivo:string;
    estado:Estado;
}

export type Estado = "En proceso"|"Finalizada"