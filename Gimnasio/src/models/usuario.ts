export interface Usuario{
    idUsuario:number,
    username:string,
    password:string,
    rol:Rol,
    estado:Estado
    fechaIngreso:Date
}

export type Estado = "Activo"|"Inactivo";

export enum Rol{
    ADMIN = "Admin",
    CLIENTE = "Cliente",
    ENTRENADOR = "Entrenador"
}