-- Tabla de rutas
CREATE TABLE rutas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    color VARCHAR(10),
    geometry GEOMETRY(LINESTRING, 4326)
);

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de paradas
CREATE TABLE paradas (
    id SERIAL PRIMARY KEY,
    id_ruta INT REFERENCES rutas(id),
    nombre VARCHAR(100),
    orden INT,
    ubicacion GEOMETRY(POINT, 4326)
);

-- Inserta rutas
INSERT INTO rutas (nombre, descripcion, color, geometry) VALUES
    ('Ruta 29', 'San Salvador - Mejicanos', '#007bff',
        ST_GeomFromText('LINESTRING(-89.2184 13.6923, -89.2075 13.6985, -89.2010 13.7052, -89.1950 13.7108)', 4326)
    ),
    ('Ruta 44', 'Soyapango - Centro de San Salvador', '#ff8800',
        ST_GeomFromText('LINESTRING(-89.1850 13.7100, -89.1900 13.7040, -89.1985 13.6965, -89.2042 13.6920)', 4326)
    ),
    ('Ruta 52', 'Santa Tecla - San Salvador', '#00c851',
        ST_GeomFromText('LINESTRING(-89.2905 13.6760, -89.2705 13.6810, -89.2500 13.6900, -89.2100 13.6950)', 4326)
    );

-- Inserta paradas
-- Ruta 29
INSERT INTO paradas (id_ruta, nombre, orden, ubicacion) VALUES
    (1, 'Terminal Mejicanos', 1, ST_SetSRID(ST_MakePoint(-89.2184, 13.6923), 4326)),
    (1, 'UCA', 2, ST_SetSRID(ST_MakePoint(-89.2075, 13.6985), 4326)),
    (1, 'Metrocentro', 3, ST_SetSRID(ST_MakePoint(-89.2010, 13.7052), 4326)),
    (1, 'Parque Cuscatlan', 4, ST_SetSRID(ST_MakePoint(-89.1950, 13.7108), 4326));

-- Ruta 44
INSERT INTO paradas (id_ruta, nombre, orden, ubicacion) VALUES
    (2, 'Plaza Mundo', 1, ST_SetSRID(ST_MakePoint(-89.1850, 13.7100), 4326)),
    (2, 'Unicentro Soyapango', 2, ST_SetSRID(ST_MakePoint(-89.1900, 13.7040), 4326)),
    (2, 'Hospital Bloom', 3, ST_SetSRID(ST_MakePoint(-89.1985, 13.6965), 4326)),
    (2, 'Centro Historico', 4, ST_SetSRID(ST_MakePoint(-89.2042, 13.6920), 4326));

-- Ruta 52
INSERT INTO paradas (id_ruta, nombre, orden, ubicacion) VALUES
    (3, 'Terminal Santa Tecla', 1, ST_SetSRID(ST_MakePoint(-89.2905, 13.6760), 4326)),
    (3, 'La Joya', 2, ST_SetSRID(ST_MakePoint(-89.2705, 13.6810), 4326)),
    (3, 'La Ceiba de Guadalupe', 3, ST_SetSRID(ST_MakePoint(-89.2500, 13.6900), 4326)),
    (3, 'Redondel Masferrer', 4, ST_SetSRID(ST_MakePoint(-89.2100, 13.6950), 4326));


