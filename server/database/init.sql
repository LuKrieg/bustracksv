-- Base de datos para BusTrackSV
-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de rutas
CREATE TABLE rutas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    color VARCHAR(10),
    geometry GEOMETRY(LINESTRING, 4326)
);

-- Tabla de paradas
CREATE TABLE paradas (
    id SERIAL PRIMARY KEY,
    id_ruta INT REFERENCES rutas(id),
    nombre VARCHAR(100),
    orden INT,
    ubicacion GEOMETRY(POINT, 4326)
);

