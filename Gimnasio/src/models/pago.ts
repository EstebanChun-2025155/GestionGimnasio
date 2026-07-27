import {MetodoPago} from "./metodoPago";
import {EstadoPago} from "./estadoPago";

export interface Pago{
    id:number;
    idCliente:number;
    idMembresia:number;
    monto:number;
    fechaPago:string;
    referencia:string;
    metodoPago:MetodoPago;
    estadoPago:EstadoPago;
}

