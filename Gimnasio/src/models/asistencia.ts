export interface Asistencia{
    idAsistencia:number;
    idCliente:number;
    idSede:number;
    fecha:Date;
    horaEntrada: string;
    horaSalida: string;
    observaciones:string;
}