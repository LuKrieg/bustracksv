-- Mostrar todos los usuarios
SELECT id, usuario, rol, fecha_creacion
FROM usuarios;

-- Mostrar rutas
SELECT id, nombre, descripcion, color
FROM rutas;

-- Mostrar paradas con nombre de la ruta
SELECT p.id, p.nombre AS parada, p.orden, r.nombre AS ruta
FROM paradas p
JOIN rutas r ON p.id_ruta = r.id
ORDER BY r.id, p.orden;

