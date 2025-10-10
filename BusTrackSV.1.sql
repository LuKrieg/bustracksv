-- Mostrar todos los usuarios
SELECT id, usuario, fecha_creacion
FROM usuarios;

-- Mostrar rutas
SELECT id, nombre, descripcion, color
FROM rutas;

-- Mostrar paradas con nombre de la ruta
SELECT p.id, p.nombre AS parada, p.orden, r.nombre AS ruta
FROM paradas p
JOIN rutas r ON p.id_ruta = r.id
ORDER BY r.id, p.orden;

-- Consulta que devuelve rutas y paradas con geometría
SELECT 
    r.id AS id_ruta,
    r.nombre AS ruta,
    r.descripcion,
    r.color,
    r.geometry AS ruta_geom,           -- geometría de la ruta (LINESTRING)
    p.id AS id_parada,
    p.nombre AS parada,
    p.orden,
    p.ubicacion AS parada_geom         -- geometría de la parada (POINT)
FROM rutas r
LEFT JOIN paradas p ON p.id_ruta = r.id
ORDER BY r.id, p.orden;