export interface Pago{
    idPago:number;
    idCliente:number;
    idMembresia:number;
    monto:number;
    metodo:MetodoPago;
    fecha_pago:Date;
    estado:EstadoPago;
    referencia:string
}

enum MetodoPago {
  TARJETA = "tarjeta",
  TRANSFERENCIA = "transferencia"
}

enum EstadoPago {
  PAGADO = "pagado",
  PENDIENTE = "pendiente",
  VENCIDO = "vencido"
}