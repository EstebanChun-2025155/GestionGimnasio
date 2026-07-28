# Sistema Integral de Gestión y Administración de Gimnasios

Sistema desarrollado para facilitar la administración de un gimnasio, centralizando el control de clientes, empleados, sedes, membresías, pagos, entrenamientos, asistencia y planes nutricionales.

El proyecto proporciona una API HTTP que permite realizar operaciones de registro, consulta, actualización y eliminación de información mediante solicitudes enviadas desde Postman.

## Objetivos

- Optimizar la administración del gimnasio y reducir el tiempo empleado en procesos manuales.
- Mejorar la atención y experiencia de los clientes mediante un servicio más organizado.
- Proporcionar información confiable que apoye el control y la toma de decisiones.

## Tecnologías utilizadas

| Tecnología | Uso dentro del proyecto |
| TypeScript | Desarrollo de la aplicación con tipado estático |
| Node.js | Entorno de ejecución del servidor |
| HTTP de Node.js | Creación del servidor y manejo de solicitudes |
| MySQL | Base de datos seleccionada para el proyecto |
| JSON | Almacenamiento temporal de los registros |
| Postman | Pruebas de rutas y solicitudes HTTP |
| pnpm | Administración de dependencias |


## Funcionalidades

El sistema permite administrar las siguientes entidades:

- Usuarios
- Sedes
- Membresías
- Clientes
- Entrenadores
- Pagos
- Rutinas
- Ejercicios
- Asistencias
- Planes nutricionales

Cada entidad cuenta con operaciones para listar, buscar, agregar, actualizar y eliminar registros.

## Flujo del proyecto

Postman
   ↓
index.ts
   ↓
Server
   ↓
Router principal
   ↓
Router de la entidad
   ↓
Service
   ↓
Validaciones y Models
   ↓
Archivos JSON
   ↓
Respuesta HTTP
   ↓
Postman
```

Actualmente, los servicios utilizan archivos JSON como almacenamiento temporal. La conexión con MySQL está configurada y se comprueba al iniciar el servidor, pero los CRUD todavía no realizan consultas sobre la base de datos.

## Estructura del proyecto

Gimnasio/
├── src/
│   ├── config/        Configuración y conexión con MySQL
│   ├── data/          Registros temporales en formato JSON
│   ├── models/        Interfaces de las entidades
│   ├── router/        Rutas HTTP generales por cada entidad
│   ├── server/        Creación y administración del servidor
│   ├── services/      Lógica CRUD de las entidades
│   ├── utils/         Validaciones y manejo de respuestas
│   └── index.ts       Punto de entrada de la aplicación
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- pnpm
- MySQL
- Postman

## Instalación

Clonar el repositorio:

git clone https://github.com/EstebanChun-2025155/GestionGimnasio.git

Ingresar a la carpeta del proyecto:

cd GestionGimnasio/Gimnasio

Instalar las dependencias:

pnpm install

## Ejecución

Iniciar el proyecto en modo de desarrollo:

pnpm run dev

Si la conexión es correcta, se mostrará:

Conexión a MySQL establecida.
Servidor ejecutándose en http://localhost:3000


La ruta principal puede comprobarse desde Postman o el navegador:

GET http://localhost:3000/

Respuesta esperada:

```json
{
  "mensaje": "API de Gestión de Gimnasio"
}
```

## Autor

Esteban Chun

Repositorio: [EstebanChun-2025155/GestionGimnasio](https://github.com/EstebanChun-2025155/GestionGimnasio)
