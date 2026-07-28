drop database if exists db_Gimnasio_in5cm;
create database db_Gimnasio_in5cm;
use db_Gimnasio_in5cm;

create table Usuario(
	id_usuario int auto_increment not null primary key,
    username varchar(30) not null,
    contrasena varchar(255) not null,
    rol enum("Admin", "Cliente", "Entrenador") not null,
    estado enum("activo", "inactivo") not null,
    fecha_registro date not null
);

create table Sedes(
	id_sede int auto_increment not null primary key,
    nombre varchar(60) not null,
    direccion varchar(150) not null,
    telefono varchar(15) not null,
	estado enum("activa", "inactiva") not null
);

create table Membresia(
	id_membresia int auto_increment not null primary key,
    nombre varchar(50) not null,
    descripcion varchar(100) not null,
    plazo int not null,
    precio decimal(10,2) not null,
    estado enum("activa", "inactiva") not null
);

create table Entrenador(
	id_entrenador int auto_increment not null primary key,
    id_usuario int not null,
    id_sede int not null,
    nombre varchar(50) not null,
    apellido varchar(50) not null,
    dpi varchar(13) not null,
    telefono varchar(15) not null,
    especialidad varchar(50),
    estado enum("activo", "inactivo") not null,
    constraint fk_entrenador_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_entrenador_sede foreign key (id_sede) references Sedes(id_sede) on delete cascade
);

create table Cliente(
	id_cliente int auto_increment not null primary key,
    id_usuario int not null,
    id_sede int not null,
    id_membresia int not null,
    nombre varchar(50) not null,
    apellido varchar(50) not null,
    dpi varchar(13) not null,
    telefono varchar(15) not null,
    correo varchar(100),
    fecha_ingreso date,
    estado enum("activo", "inactivo") not null,
    constraint fk_cliente_usuario foreign key (id_usuario) references Usuario(id_usuario) on delete cascade,
    constraint fk_cliente_sede foreign key (id_sede) references Sedes(id_sede) on delete cascade,
    constraint fk_cliente_membresia foreign key (id_membresia) references Membresia(id_membresia) on delete cascade
);

create table Pago(
	id_pago int auto_increment not null primary key,
    id_cliente int not null,
    id_membresia int not null,
    monto decimal(10,2) not null,
    metodo_pago enum("efectivo", "tarjeta", "transferencia") not null,
    fecha_pago date not null,
    estado_pago enum("pagado", "pendiente", "anulado") not null,
    referencia varchar(100),
    constraint fk_pago_cliente foreign key (id_cliente) references Cliente(id_cliente) on delete cascade,
    constraint fk_pago_membresia foreign key (id_membresia) references Membresia(id_membresia) on delete cascade
);

create table Rutina(
	id_rutina int auto_increment not null primary key,
    id_cliente int not null,
    id_entrenador int not null,
    nombre varchar(45) not null,
    objetivo varchar(100) not null,
    estado enum ("activa", "finalizada") not null,
    constraint fk_rutina_cliente foreign key (id_cliente) references Cliente(id_cliente) on delete cascade,
    constraint fk_rutina_entrenador foreign key (id_entrenador) references Entrenador(id_entrenador) on delete cascade
);

create table Ejercicio(
	id_ejercicio int auto_increment not null primary key,
    id_rutina int not null,
    nombre varchar(100) not null,
    grupo_muscular varchar(100) not null,
    series int not null,
    repeticiones int not null,
    descanso int not null,
    instrucciones varchar (150),
    constraint fk_ejercicio_rutina foreign key (id_rutina) references Rutina(id_rutina) on delete cascade
);

create table Asistencia(
	id_asistencia int auto_increment not null primary key,
    id_cliente int not null,
    id_sede int not null,
    fecha date not null,
    hora_entrada time not null, 
    hora_salida time,
    observaciones varchar(100),
    constraint fk_asistencia_cliente foreign key (id_cliente) references Cliente(id_cliente) on delete cascade,
    constraint fk_asistencia_sede foreign key (id_sede) references Sedes(id_sede) on delete cascade
);

create table PlanNutricional(
	id_plan_nutricional int auto_increment not null primary key,
    id_cliente int not null,
    id_entrenador int not null,
    objetivo varchar(100),
    calorias_diarias int not null,
    fecha_inicio date not null,
    fecha_fin date,
    instrucciones varchar(100),
    estado enum("activo", "finalizado") not null, 
    constraint fk_plan_cliente foreign key (id_cliente) references Cliente(id_cliente) on delete cascade,
    constraint fk_plan_entrenador foreign key (id_entrenador) references Entrenador(id_entrenador) on delete cascade    
);


