import {MetodoPago} from "./metodoPago";
import {EstadoPago} from "./estadoPago";

export interface Pago{
    idPago:number;
    idCliente:number;
    idMembresia:number;
    monto:number;
    fecha_pago:Date;
    referencia:string;
    metodoPago:MetodoPago;
    estadoPago:EstadoPago;
}

