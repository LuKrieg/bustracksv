import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool, testConnection } from "./db.js";

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ===============================
// 🔹 MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// Middleware para validar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET || "secret_key_default", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
};

// ===============================
// 🔹 RUTAS DE AUTENTICACIÓN
// ===============================

// Registrar usuario
app.post("/register", async (req, res) => {
  const { usuario, password, email, nombre_completo, telefono } = req.body;

  try {
    console.log('🔄 Intentando registrar usuario:', { usuario, email });
    
    // Validar datos requeridos
    if (!usuario || !password) {
      console.log('❌ Datos requeridos faltantes');
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }

    // Verificar que el usuario no exista
    console.log('🔍 Verificando si el usuario ya existe...');
    const existingUser = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = $1 OR email = $2",
      [usuario, email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('❌ Usuario o email ya existe');
      return res.status(409).json({ message: "El usuario o email ya existe" });
    }

    // Hashear password y crear usuario
    console.log('🔐 Hasheando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('💾 Insertando usuario en la base de datos...');
    const result = await pool.query(
      "INSERT INTO usuarios (usuario, password, email, nombre_completo, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [usuario, hashedPassword, email, nombre_completo, telefono]
    );

    console.log('✅ Usuario registrado exitosamente con ID:', result.rows[0].id);
    res.status(201).json({ 
      message: "Usuario registrado con éxito",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({ 
      message: "Error al registrar usuario",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Actualizar último acceso
    await pool.query(
      "UPDATE usuarios SET ultimo_acceso = datetime('now') WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: user.usuario,
      id: user.id
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Validar token y obtener info del usuario
app.get("/validate", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario FROM usuarios WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    res.json({
      message: "Token válido",
      usuario: user.usuario,
      id: user.id,
    });
  } catch (err) {
    console.error("Error al validar token:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ===============================
// 🔹 RUTAS BÁSICAS DE USUARIO
// ===============================

// Obtener perfil del usuario autenticado (SIMPLIFICADO)
app.get("/perfil", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario, email, nombre_completo, telefono, fecha_creacion, ultimo_acceso FROM usuarios WHERE id = $1",
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// Actualizar perfil del usuario autenticado (SIMPLIFICADO)
app.put("/perfil", authenticateToken, async (req, res) => {
  const { usuario, nombre_completo, email, telefono } = req.body;
  
  try {
    // Validar que el usuario no esté en uso por otro usuario
    if (usuario) {
      const existingUsuario = await pool.query(
        "SELECT id FROM usuarios WHERE usuario = $1 AND id != $2",
        [usuario, req.user.id]
      );
      
      if (existingUsuario.rows.length > 0) {
        return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
      }
    }
    
    // Validar que el email no esté en uso por otro usuario
    if (email) {
      const existingUser = await pool.query(
        "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
        [email, req.user.id]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ message: "El email ya está en uso por otro usuario" });
      }
    }
    
    // Construir la consulta de actualización dinámicamente
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (usuario !== undefined) {
      updates.push(`usuario = $${paramCount}`);
      values.push(usuario);
      paramCount++;
    }
    
    if (nombre_completo !== undefined) {
      updates.push(`nombre_completo = $${paramCount}`);
      values.push(nombre_completo);
      paramCount++;
    }
    
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (telefono !== undefined) {
      updates.push(`telefono = $${paramCount}`);
      values.push(telefono);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }
    
    // Agregar el ID del usuario al final
    values.push(req.user.id);
    
    const query = `
      UPDATE usuarios 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, usuario, email, nombre_completo, telefono
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.json({
      message: "Perfil actualizado exitosamente",
      usuario: result.rows[0]
    });
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(500).json({ 
      message: "Error al actualizar perfil",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Cambiar contraseña
app.put("/perfil/password", authenticateToken, async (req, res) => {
  const { password_actual, password_nueva } = req.body;
  
  if (!password_actual || !password_nueva) {
    return res.status(400).json({ message: "Se requiere la contraseña actual y la nueva" });
  }
  
  if (password_nueva.length < 6) {
    return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" });
  }
  
  try {
    // Verificar contraseña actual
    const userResult = await pool.query(
      "SELECT password FROM usuarios WHERE id = $1",
      [req.user.id]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    const validPassword = await bcrypt.compare(password_actual, userResult.rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }
    
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password_nueva, 10);
    
    // Actualizar contraseña
    await pool.query(
      "UPDATE usuarios SET password = $1 WHERE id = $2",
      [hashedPassword, req.user.id]
    );
    
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
});

// ===============================
// 🔹 RUTAS BÁSICAS (SIN POSTGIS)
// ===============================

// Obtener todas las rutas (simplificado)
app.get("/api/rutas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, descripcion, color, numero_ruta, empresa, tipo, tarifa
      FROM rutas
      WHERE activa = 1
      ORDER BY numero_ruta
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener rutas:", err);
    res.json([]);
  }
});

// Obtener paradas de una ruta específica (ordenadas)
app.get("/api/rutas/:id/paradas", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.codigo, 
        p.nombre, 
        p.descripcion, 
        p.direccion, 
        p.latitud, 
        p.longitud, 
        p.zona, 
        p.tipo,
        pr.orden,
        pr.tiempo_estimado_minutos
      FROM paradas p
      JOIN parada_ruta pr ON p.id = pr.id_parada
      WHERE pr.id_ruta = $1 AND p.activa = 1
      ORDER BY pr.orden ASC
    `, [id]);
    
    res.json(result.rows.map(p => ({
      ...p,
      latitud: parseFloat(p.latitud),
      longitud: parseFloat(p.longitud),
      orden: parseInt(p.orden)
    })));
  } catch (err) {
    console.error(`Error al obtener paradas de ruta ${id}:`, err);
    res.json([]);
  }
});

// Obtener todas las paradas (simplificado)
app.get("/api/paradas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, codigo, nombre, descripcion, direccion, latitud, longitud, zona, tipo
      FROM paradas
      WHERE activa = 1
      ORDER BY nombre
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener paradas:", err);
    res.json([]);
  }
});

// Buscar paradas cercanas a una ubicación
app.get("/api/paradas-cercanas", async (req, res) => {
  const { lat, lng, radio = 500, limite = 10 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      success: false,
      message: "Se requieren parámetros lat y lng" 
    });
  }
  
  try {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    // Obtener todas las paradas activas
    const result = await pool.query(`
      SELECT id, codigo, nombre, descripcion, direccion, latitud, longitud, zona, tipo
      FROM paradas
      WHERE activa = 1
      ORDER BY nombre
    `);
    
    // Calcular distancia y filtrar
    const paradasConDistancia = result.rows
      .map(parada => {
        const R = 6371000; // Radio de la Tierra en metros
        const dLat = (parseFloat(parada.latitud) - latNum) * Math.PI / 180;
        const dLon = (parseFloat(parada.longitud) - lngNum) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latNum * Math.PI / 180) * Math.cos(parseFloat(parada.latitud) * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distancia = R * c;
        
        return {
          ...parada,
          distancia_metros: Math.round(distancia),
          latitud: parseFloat(parada.latitud),
          longitud: parseFloat(parada.longitud)
        };
      })
      .filter(p => p.distancia_metros <= parseInt(radio))
      .sort((a, b) => a.distancia_metros - b.distancia_metros)
      .slice(0, parseInt(limite));
    
    res.json({
      success: true,
      ubicacion: { lat: latNum, lng: lngNum },
      radio_metros: parseInt(radio),
      total_encontradas: paradasConDistancia.length,
      paradas: paradasConDistancia
    });
  } catch (err) {
    console.error("Error al buscar paradas cercanas:", err);
    res.status(500).json({
      success: false,
      message: "Error al buscar paradas cercanas",
      error: err.message
    });
  }
});

// Buscar rutas cercanas a una ubicación
app.get("/api/rutas-cercanas", async (req, res) => {
  const { lat, lng, radio = 500, limite = 10 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      success: false,
      message: "Se requieren parámetros lat y lng" 
    });
  }
  
  try {
    // Primero buscar paradas cercanas
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    const paradasResult = await pool.query(`
      SELECT id, nombre, latitud, longitud
      FROM paradas
      WHERE activa = 1
    `);
    
    // Filtrar paradas cercanas
    const paradasCercanas = paradasResult.rows
      .map(parada => {
        const R = 6371000;
        const dLat = (parseFloat(parada.latitud) - latNum) * Math.PI / 180;
        const dLon = (parseFloat(parada.longitud) - lngNum) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(latNum * Math.PI / 180) * Math.cos(parseFloat(parada.latitud) * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distancia = R * c;
        
        return { ...parada, distancia_metros: Math.round(distancia) };
      })
      .filter(p => p.distancia_metros <= parseInt(radio))
      .map(p => p.id);
    
    if (paradasCercanas.length === 0) {
      return res.json({
        success: true,
        ubicacion: { lat: latNum, lng: lngNum },
        rutas: []
      });
    }
    
    // Buscar rutas que pasan por esas paradas
    const placeholders = paradasCercanas.map(() => '?').join(',');
    const rutasResult = await pool.query(`
      SELECT DISTINCT r.id, r.numero_ruta, r.nombre, r.empresa, r.tipo, r.tarifa, r.color
      FROM rutas r
      JOIN parada_ruta pr ON r.id = pr.id_ruta
      WHERE r.activa = 1 AND pr.id_parada IN (${placeholders})
      LIMIT ?
    `, [...paradasCercanas, parseInt(limite)]);
    
    res.json({
      success: true,
      ubicacion: { lat: latNum, lng: lngNum },
      rutas: rutasResult.rows.map(r => ({
        ...r,
        tarifa: parseFloat(r.tarifa)
      }))
    });
  } catch (err) {
    console.error("Error al buscar rutas cercanas:", err);
    res.status(500).json({
      success: false,
      message: "Error al buscar rutas cercanas",
      error: err.message
    });
  }
});

// Recomendar ruta entre dos puntos (endpoint principal con transbordos)
app.post("/api/recomendar-ruta", async (req, res) => {
  const { inicioLat, inicioLng, destinoLat, destinoLng, radio = 1500 } = req.body; // Radio aumentado a 1.5km
  
  if (!inicioLat || !inicioLng || !destinoLat || !destinoLng) {
    return res.status(400).json({ 
      success: false,
      message: "Se requieren parámetros: inicioLat, inicioLng, destinoLat, destinoLng" 
    });
  }
  
  try {
    console.log('🔍 Buscando ruta óptima entre:', { inicioLat, inicioLng, destinoLat, destinoLng });
    
    const latInicio = parseFloat(inicioLat);
    const lngInicio = parseFloat(inicioLng);
    const latDestino = parseFloat(destinoLat);
    const lngDestino = parseFloat(destinoLng);
    
    // Función auxiliar para calcular distancia
    const calcularDistancia = (lat1, lng1, lat2, lng2) => {
      const R = 6371000; // metros
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };
    
    // 1. Buscar paradas cercanas al origen
    const todasParadas = await pool.query("SELECT * FROM paradas WHERE activa = 1");
    
    const paradasOrigen = todasParadas.rows
      .map(p => ({
        ...p,
        distancia: calcularDistancia(latInicio, lngInicio, parseFloat(p.latitud), parseFloat(p.longitud))
      }))
      .filter(p => p.distancia <= radio)
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 10);
    
    // 2. Buscar paradas cercanas al destino
    const paradasDestino = todasParadas.rows
      .map(p => ({
        ...p,
        distancia: calcularDistancia(latDestino, lngDestino, parseFloat(p.latitud), parseFloat(p.longitud))
      }))
      .filter(p => p.distancia <= radio)
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, 10);
    
    if (paradasOrigen.length === 0 || paradasDestino.length === 0) {
      // Sugerir paradas hub más cercanas
      const paradasHub = await pool.query(`
        SELECT p.*, COUNT(DISTINCT pr.id_ruta) as num_rutas,
               CASE p.tipo
                 WHEN 'Terminal' THEN 5
                 WHEN 'TransferHub' THEN 4
                 ELSE 1
               END as prioridad
        FROM paradas p
        LEFT JOIN parada_ruta pr ON p.id = pr.id_parada
        WHERE p.activa = 1
        GROUP BY p.id
        HAVING num_rutas >= 3
        ORDER BY prioridad DESC, num_rutas DESC
        LIMIT 5
      `);
      
      const sugerenciasOrigen = paradasHub.rows.map(p => ({
        ...p,
        distancia: calcularDistancia(latInicio, lngInicio, parseFloat(p.latitud), parseFloat(p.longitud))
      })).sort((a, b) => a.distancia - b.distancia).slice(0, 3);
      
      const sugerenciasDestino = paradasHub.rows.map(p => ({
        ...p,
        distancia: calcularDistancia(latDestino, lngDestino, parseFloat(p.latitud), parseFloat(p.longitud))
      })).sort((a, b) => a.distancia - b.distancia).slice(0, 3);
      
      return res.json({
        exito: false,
        mensaje: "No se encontraron paradas cercanas. Intenta con estas paradas populares:",
        origen: { lat: latInicio, lng: lngInicio },
        destino: { lat: latDestino, lng: lngDestino },
        paradasOrigen,
        paradasDestino,
        sugerenciasOrigen,
        sugerenciasDestino,
        recomendaciones: []
      });
    }
    
    // 3. Buscar rutas directas
    const idsOrigen = paradasOrigen.map(p => p.id);
    const idsDestino = paradasDestino.map(p => p.id);
    
    if (idsOrigen.length === 0 || idsDestino.length === 0) {
      return res.json({
        exito: false,
        mensaje: "No hay paradas cercanas suficientes",
        origen: { lat: latInicio, lng: lngInicio },
        destino: { lat: latDestino, lng: lngDestino },
        paradasOrigen,
        paradasDestino,
        recomendaciones: []
      });
    }
    
    // Crear placeholders para la consulta
    const origenPlaceholders = idsOrigen.map(() => '?').join(',');
    const destinoPlaceholders = idsDestino.map(() => '?').join(',');
    
    const rutasDirectas = await pool.query(`
      SELECT DISTINCT
        r.id, r.numero_ruta, r.nombre, r.empresa, r.tipo, r.tarifa, r.color,
        pr1.id_parada as parada_origen_id,
        p1.nombre as parada_origen_nombre,
        p1.latitud as parada_origen_lat,
        p1.longitud as parada_origen_lng,
        pr1.orden as orden_origen,
        pr1.tiempo_estimado_minutos as tiempo_origen,
        pr2.id_parada as parada_destino_id,
        p2.nombre as parada_destino_nombre,
        p2.latitud as parada_destino_lat,
        p2.longitud as parada_destino_lng,
        pr2.orden as orden_destino,
        pr2.tiempo_estimado_minutos as tiempo_destino
      FROM rutas r
      JOIN parada_ruta pr1 ON r.id = pr1.id_ruta
      JOIN parada_ruta pr2 ON r.id = pr2.id_ruta
      JOIN paradas p1 ON pr1.id_parada = p1.id
      JOIN paradas p2 ON pr2.id_parada = p2.id
      WHERE r.activa = 1
        AND pr1.id_parada IN (${origenPlaceholders})
        AND pr2.id_parada IN (${destinoPlaceholders})
        AND pr1.orden < pr2.orden
      ORDER BY (pr2.tiempo_estimado_minutos - pr1.tiempo_estimado_minutos) ASC
      LIMIT 5
    `, [...idsOrigen, ...idsDestino]);
    
    // Procesar rutas directas
    const recomendaciones = [];
    for (const ruta of rutasDirectas.rows) {
      const paradasIntermedias = await pool.query(`
        SELECT p.id, p.nombre, p.latitud, p.longitud, pr.orden
        FROM paradas p
        JOIN parada_ruta pr ON p.id = pr.id_parada
        WHERE pr.id_ruta = $1 AND pr.orden >= $2 AND pr.orden <= $3
        ORDER BY pr.orden
      `, [ruta.id, ruta.orden_origen, ruta.orden_destino]);
      
      // Calcular distancias de caminata
      const distanciaCaminataOrigen = calcularDistancia(
        latInicio, 
        lngInicio, 
        parseFloat(ruta.parada_origen_lat), 
        parseFloat(ruta.parada_origen_lng)
      );
      
      const distanciaCaminataDestino = calcularDistancia(
        parseFloat(ruta.parada_destino_lat),
        parseFloat(ruta.parada_destino_lng),
        latDestino,
        lngDestino
      );

      recomendaciones.push({
        tipo: 'directa',
        transbordos: 0,
        segmentos: [
          {
            tipo: 'bus',
            ruta: {
              id: ruta.id,
              numero_ruta: ruta.numero_ruta,
              nombre: ruta.nombre,
              empresa: ruta.empresa,
              tipo: ruta.tipo,
              tarifa: parseFloat(ruta.tarifa),
              color: ruta.color
            },
            paradaOrigen: {
              id: ruta.parada_origen_id,
              nombre: ruta.parada_origen_nombre,
              latitud: parseFloat(ruta.parada_origen_lat),
              longitud: parseFloat(ruta.parada_origen_lng)
            },
            paradaDestino: {
              id: ruta.parada_destino_id,
              nombre: ruta.parada_destino_nombre,
              latitud: parseFloat(ruta.parada_destino_lat),
              longitud: parseFloat(ruta.parada_destino_lng)
            },
            paradasIntermedias: paradasIntermedias.rows.map(p => ({
              id: p.id,
              nombre: p.nombre,
              latitud: parseFloat(p.latitud),
              longitud: parseFloat(p.longitud),
              orden: p.orden
            })),
            tiempoEstimadoMinutos: ruta.tiempo_destino - ruta.tiempo_origen
          }
        ],
        tiempoEstimadoMinutos: ruta.tiempo_destino - ruta.tiempo_origen,
        tarifaTotal: parseFloat(ruta.tarifa),
        distanciaLineaRecta: calcularDistancia(latInicio, lngInicio, latDestino, lngDestino) / 1000,
        distanciaCaminataOrigenMetros: distanciaCaminataOrigen,
        distanciaCaminataDestinoMetros: distanciaCaminataDestino,
        numParadas: paradasIntermedias.rows.length
      });
    }
    
    // 4. Buscar rutas con 1 transbordo (SIEMPRE buscar opciones)
    if (recomendaciones.length < 15) {
      console.log('🔍 Buscando rutas con 1 transbordo...');
      console.log(`   Paradas origen encontradas: ${paradasOrigen.length}`);
      console.log(`   Paradas destino encontradas: ${paradasDestino.length}`);
      
      // Obtener rutas desde el origen
      const rutasDesdeOrigen = await pool.query(`
        SELECT DISTINCT
          r.id as ruta_id,
          r.numero_ruta,
          r.nombre,
          r.empresa,
          r.tipo,
          r.tarifa,
          r.color,
          pr.id_parada as parada_id,
          p.nombre as parada_nombre,
          p.latitud as parada_lat,
          p.longitud as parada_lng,
          pr.orden,
          pr.tiempo_estimado_minutos
        FROM rutas r
        JOIN parada_ruta pr ON r.id = pr.id_ruta
        JOIN paradas p ON pr.id_parada = p.id
        WHERE r.activa = 1 AND p.activa = 1
      `);
      
      // Agrupar por ruta
      const rutasPorId = {};
      for (const row of rutasDesdeOrigen.rows) {
        if (!rutasPorId[row.ruta_id]) {
          rutasPorId[row.ruta_id] = {
            id: row.ruta_id,
            numero_ruta: row.numero_ruta,
            nombre: row.nombre,
            empresa: row.empresa,
            tipo: row.tipo,
            tarifa: parseFloat(row.tarifa),
            color: row.color,
            paradas: []
          };
        }
        rutasPorId[row.ruta_id].paradas.push({
          id: row.parada_id,
          nombre: row.parada_nombre,
          latitud: parseFloat(row.parada_lat),
          longitud: parseFloat(row.parada_lng),
          orden: row.orden,
          tiempo_estimado_minutos: row.tiempo_estimado_minutos
        });
      }
      
      // Ordenar paradas por orden
      for (const rutaId in rutasPorId) {
        rutasPorId[rutaId].paradas.sort((a, b) => a.orden - b.orden);
      }
      
      console.log(`   Total rutas en el sistema: ${Object.keys(rutasPorId).length}`);
      console.log(`   IDs paradas origen: ${idsOrigen.join(', ')}`);
      console.log(`   IDs paradas destino: ${idsDestino.join(', ')}`);
      
      const transbordos = [];
      
      // Buscar combinaciones de 2 rutas
      for (const paradaOrigenId of idsOrigen) {
        // Rutas que pasan por el origen
        const ruta1Options = Object.values(rutasPorId).filter(r => 
          r.paradas.some(p => p.id === paradaOrigenId)
        );
        
        console.log(`   Parada origen ${paradaOrigenId}: ${ruta1Options.length} rutas disponibles`);
        
        for (const ruta1 of ruta1Options) {
          const indexOrigen = ruta1.paradas.findIndex(p => p.id === paradaOrigenId);
          if (indexOrigen === -1) continue;
          
          // Paradas posteriores en la ruta 1 (posibles transbordos)
          const paradasTransbordo = ruta1.paradas.slice(indexOrigen + 1);
          
          for (const paradaTransbordo of paradasTransbordo) {
            // Buscar rutas que pasan por la parada de transbordo y llegan al destino
            for (const paradaDestinoId of idsDestino) {
              const ruta2Options = Object.values(rutasPorId).filter(r => 
                r.id !== ruta1.id && // Diferente ruta
                r.paradas.some(p => p.id === paradaTransbordo.id) &&
                r.paradas.some(p => p.id === paradaDestinoId)
              );
              
              for (const ruta2 of ruta2Options) {
                const indexTransbordo = ruta2.paradas.findIndex(p => p.id === paradaTransbordo.id);
                const indexDestino = ruta2.paradas.findIndex(p => p.id === paradaDestinoId);
                
                if (indexTransbordo !== -1 && indexDestino !== -1 && indexTransbordo < indexDestino) {
                  const paradaOrigen = ruta1.paradas[indexOrigen];
                  const paradaDestino = ruta2.paradas[indexDestino];
                  
                  // Calcular tiempos, manejando casos null
                  const tiempoOrigenMin = paradaOrigen.tiempo_estimado_minutos || 0;
                  const tiempoTransbordoMin = paradaTransbordo.tiempo_estimado_minutos || (tiempoOrigenMin + 15);
                  const tiempoDestinoMin = paradaDestino.tiempo_estimado_minutos || (tiempoTransbordoMin + 15);
                  
                  const tiempo1 = Math.max(tiempoTransbordoMin - tiempoOrigenMin, 5);
                  const tiempo2 = Math.max(tiempoDestinoMin - tiempoTransbordoMin, 5);
                  const tiempoTotal = tiempo1 + tiempo2 + 5; // 5 min de espera
                  
                  const distanciaCaminataOrigen = calcularDistancia(
                    latInicio, 
                    lngInicio, 
                    paradaOrigen.latitud,
                    paradaOrigen.longitud
                  );
                  
                  const distanciaCaminataDestino = calcularDistancia(
                    paradaDestino.latitud,
                    paradaDestino.longitud,
                    latDestino,
                    lngDestino
                  );
                  
                  console.log(`   ✅ Transbordo encontrado: Ruta ${ruta1.numero_ruta} → Ruta ${ruta2.numero_ruta}`);
                  
                  transbordos.push({
                    tipo: 'transbordo',
                    transbordos: 1,
                    segmentos: [
                      {
                        tipo: 'bus',
                        ruta: {
                          id: ruta1.id,
                          numero_ruta: ruta1.numero_ruta,
                          nombre: ruta1.nombre,
                          empresa: ruta1.empresa,
                          tipo: ruta1.tipo,
                          tarifa: ruta1.tarifa,
                          color: ruta1.color
                        },
                        paradaOrigen: {
                          id: paradaOrigen.id,
                          nombre: paradaOrigen.nombre,
                          latitud: paradaOrigen.latitud,
                          longitud: paradaOrigen.longitud
                        },
                        paradaDestino: {
                          id: paradaTransbordo.id,
                          nombre: paradaTransbordo.nombre,
                          latitud: paradaTransbordo.latitud,
                          longitud: paradaTransbordo.longitud
                        },
                        paradasIntermedias: ruta1.paradas.slice(indexOrigen, ruta1.paradas.findIndex(p => p.id === paradaTransbordo.id) + 1),
                        tiempoEstimadoMinutos: tiempo1
                      },
                      {
                        tipo: 'bus',
                        ruta: {
                          id: ruta2.id,
                          numero_ruta: ruta2.numero_ruta,
                          nombre: ruta2.nombre,
                          empresa: ruta2.empresa,
                          tipo: ruta2.tipo,
                          tarifa: ruta2.tarifa,
                          color: ruta2.color
                        },
                        paradaOrigen: {
                          id: paradaTransbordo.id,
                          nombre: paradaTransbordo.nombre,
                          latitud: paradaTransbordo.latitud,
                          longitud: paradaTransbordo.longitud
                        },
                        paradaDestino: {
                          id: paradaDestino.id,
                          nombre: paradaDestino.nombre,
                          latitud: paradaDestino.latitud,
                          longitud: paradaDestino.longitud
                        },
                        paradasIntermedias: ruta2.paradas.slice(indexTransbordo, indexDestino + 1),
                        tiempoEstimadoMinutos: tiempo2
                      }
                    ],
                    paradaTransbordo: {
                      id: paradaTransbordo.id,
                      nombre: paradaTransbordo.nombre,
                      latitud: paradaTransbordo.latitud,
                      longitud: paradaTransbordo.longitud
                    },
                    tiempoEstimadoMinutos: tiempoTotal,
                    tarifaTotal: ruta1.tarifa + ruta2.tarifa,
                    distanciaLineaRecta: calcularDistancia(latInicio, lngInicio, latDestino, lngDestino) / 1000,
                    distanciaCaminataOrigenMetros: distanciaCaminataOrigen,
                    distanciaCaminataDestinoMetros: distanciaCaminataDestino,
                    numParadas: (ruta1.paradas.slice(indexOrigen, ruta1.paradas.findIndex(p => p.id === paradaTransbordo.id) + 1).length + 
                                ruta2.paradas.slice(indexTransbordo, indexDestino + 1).length)
                  });
                }
              }
            }
          }
        }
      }
      
      // Ordenar por tiempo y tomar las mejores 10
      transbordos.sort((a, b) => a.tiempoEstimadoMinutos - b.tiempoEstimadoMinutos);
      recomendaciones.push(...transbordos.slice(0, 10));
      
      console.log(`✅ Encontradas ${transbordos.length} rutas con 1 transbordo`);
    }
    
    // 5. Buscar rutas con 2 transbordos (3 buses) - SIEMPRE buscar más opciones
    if (recomendaciones.length < 10) {
      console.log('🔍 Buscando rutas con 2 transbordos (3 buses)...');
      
      const transbordos2 = [];
      const rutasPorId = {}; // Reutilizar estructura
      
      // Obtener todas las rutas con sus paradas
      const todasLasRutas = await pool.query(`
        SELECT DISTINCT
          r.id as ruta_id,
          r.numero_ruta,
          r.nombre,
          r.empresa,
          r.tipo,
          r.tarifa,
          r.color,
          pr.id_parada as parada_id,
          p.nombre as parada_nombre,
          p.latitud as parada_lat,
          p.longitud as parada_lng,
          pr.orden,
          pr.tiempo_estimado_minutos
        FROM rutas r
        JOIN parada_ruta pr ON r.id = pr.id_ruta
        JOIN paradas p ON pr.id_parada = p.id
        WHERE r.activa = 1 AND p.activa = 1
      `);
      
      // Agrupar por ruta
      for (const row of todasLasRutas.rows) {
        if (!rutasPorId[row.ruta_id]) {
          rutasPorId[row.ruta_id] = {
            id: row.ruta_id,
            numero_ruta: row.numero_ruta,
            nombre: row.nombre,
            empresa: row.empresa,
            tipo: row.tipo,
            tarifa: parseFloat(row.tarifa),
            color: row.color,
            paradas: []
          };
        }
        rutasPorId[row.ruta_id].paradas.push({
          id: row.parada_id,
          nombre: row.parada_nombre,
          latitud: parseFloat(row.parada_lat),
          longitud: parseFloat(row.parada_lng),
          orden: row.orden,
          tiempo_estimado_minutos: row.tiempo_estimado_minutos
        });
      }
      
      // Ordenar paradas por orden
      for (const rutaId in rutasPorId) {
        rutasPorId[rutaId].paradas.sort((a, b) => a.orden - b.orden);
      }
      
      // Buscar combinaciones de 3 rutas (limitado para evitar explosión combinatoria)
      let combinacionesProbadas = 0;
      const maxCombinaciones = 5000; // Límite aumentado para más opciones
      
      for (const paradaOrigenId of idsOrigen.slice(0, 10)) { // Más paradas de origen
        const ruta1Options = Object.values(rutasPorId).filter(r => 
          r.paradas.some(p => p.id === paradaOrigenId)
        ).slice(0, 5); // Más rutas por parada
        
        for (const ruta1 of ruta1Options) {
          const indexOrigen = ruta1.paradas.findIndex(p => p.id === paradaOrigenId);
          if (indexOrigen === -1) continue;
          
          // Paradas posteriores en ruta 1 (primer transbordo)
          const paradasTransbordo1 = ruta1.paradas.slice(indexOrigen + 1, indexOrigen + 6); // Máximo 5 paradas
          
          for (const paradaT1 of paradasTransbordo1) {
            // Buscar ruta 2 que pase por paradaT1
            const ruta2Options = Object.values(rutasPorId).filter(r => 
              r.id !== ruta1.id &&
              r.paradas.some(p => p.id === paradaT1.id)
            ).slice(0, 3);
            
            for (const ruta2 of ruta2Options) {
              const indexT1 = ruta2.paradas.findIndex(p => p.id === paradaT1.id);
              if (indexT1 === -1) continue;
              
              // Paradas posteriores en ruta 2 (segundo transbordo)
              const paradasTransbordo2 = ruta2.paradas.slice(indexT1 + 1, indexT1 + 6);
              
              for (const paradaT2 of paradasTransbordo2) {
                // Buscar ruta 3 que conecte paradaT2 con destino
                for (const paradaDestinoId of idsDestino.slice(0, 5)) {
                  if (combinacionesProbadas++ > maxCombinaciones) break;
                  
                  const ruta3Options = Object.values(rutasPorId).filter(r => 
                    r.id !== ruta1.id && r.id !== ruta2.id &&
                    r.paradas.some(p => p.id === paradaT2.id) &&
                    r.paradas.some(p => p.id === paradaDestinoId)
                  ).slice(0, 2);
                  
                  for (const ruta3 of ruta3Options) {
                    const indexT2 = ruta3.paradas.findIndex(p => p.id === paradaT2.id);
                    const indexDestino = ruta3.paradas.findIndex(p => p.id === paradaDestinoId);
                    
                    if (indexT2 !== -1 && indexDestino !== -1 && indexT2 < indexDestino) {
                      const paradaOrigen = ruta1.paradas[indexOrigen];
                      const paradaDestino = ruta3.paradas[indexDestino];
                      
                      // Calcular tiempos
                      const tiempo1 = Math.max((paradaT1.tiempo_estimado_minutos || 15) - (paradaOrigen.tiempo_estimado_minutos || 0), 5);
                      const tiempo2 = Math.max((paradaT2.tiempo_estimado_minutos || 15) - (paradaT1.tiempo_estimado_minutos || 0), 5);
                      const tiempo3 = Math.max((paradaDestino.tiempo_estimado_minutos || 15) - (paradaT2.tiempo_estimado_minutos || 0), 5);
                      const tiempoTotal = tiempo1 + tiempo2 + tiempo3 + 10; // 10 min de espera total
                      
                      const distanciaCaminataOrigen = calcularDistancia(
                        latInicio, lngInicio,
                        paradaOrigen.latitud, paradaOrigen.longitud
                      );
                      
                      const distanciaCaminataDestino = calcularDistancia(
                        paradaDestino.latitud, paradaDestino.longitud,
                        latDestino, lngDestino
                      );
                      
                      transbordos2.push({
                        tipo: 'transbordo',
                        transbordos: 2,
                        segmentos: [
                          {
                            tipo: 'bus',
                            ruta: { id: ruta1.id, numero_ruta: ruta1.numero_ruta, nombre: ruta1.nombre, empresa: ruta1.empresa, tipo: ruta1.tipo, tarifa: ruta1.tarifa, color: ruta1.color },
                            paradaOrigen: { id: paradaOrigen.id, nombre: paradaOrigen.nombre, latitud: paradaOrigen.latitud, longitud: paradaOrigen.longitud },
                            paradaDestino: { id: paradaT1.id, nombre: paradaT1.nombre, latitud: paradaT1.latitud, longitud: paradaT1.longitud },
                            paradasIntermedias: ruta1.paradas.slice(indexOrigen, ruta1.paradas.findIndex(p => p.id === paradaT1.id) + 1),
                            tiempoEstimadoMinutos: tiempo1
                          },
                          {
                            tipo: 'bus',
                            ruta: { id: ruta2.id, numero_ruta: ruta2.numero_ruta, nombre: ruta2.nombre, empresa: ruta2.empresa, tipo: ruta2.tipo, tarifa: ruta2.tarifa, color: ruta2.color },
                            paradaOrigen: { id: paradaT1.id, nombre: paradaT1.nombre, latitud: paradaT1.latitud, longitud: paradaT1.longitud },
                            paradaDestino: { id: paradaT2.id, nombre: paradaT2.nombre, latitud: paradaT2.latitud, longitud: paradaT2.longitud },
                            paradasIntermedias: ruta2.paradas.slice(indexT1, ruta2.paradas.findIndex(p => p.id === paradaT2.id) + 1),
                            tiempoEstimadoMinutos: tiempo2
                          },
                          {
                            tipo: 'bus',
                            ruta: { id: ruta3.id, numero_ruta: ruta3.numero_ruta, nombre: ruta3.nombre, empresa: ruta3.empresa, tipo: ruta3.tipo, tarifa: ruta3.tarifa, color: ruta3.color },
                            paradaOrigen: { id: paradaT2.id, nombre: paradaT2.nombre, latitud: paradaT2.latitud, longitud: paradaT2.longitud },
                            paradaDestino: { id: paradaDestino.id, nombre: paradaDestino.nombre, latitud: paradaDestino.latitud, longitud: paradaDestino.longitud },
                            paradasIntermedias: ruta3.paradas.slice(indexT2, indexDestino + 1),
                            tiempoEstimadoMinutos: tiempo3
                          }
                        ],
                        tiempoEstimadoMinutos: tiempoTotal,
                        tarifaTotal: ruta1.tarifa + ruta2.tarifa + ruta3.tarifa,
                        distanciaLineaRecta: calcularDistancia(latInicio, lngInicio, latDestino, lngDestino) / 1000,
                        distanciaCaminataOrigenMetros: distanciaCaminataOrigen,
                        distanciaCaminataDestinoMetros: distanciaCaminataDestino,
                        numParadas: ruta1.paradas.slice(indexOrigen, ruta1.paradas.findIndex(p => p.id === paradaT1.id) + 1).length +
                                   ruta2.paradas.slice(indexT1, ruta2.paradas.findIndex(p => p.id === paradaT2.id) + 1).length +
                                   ruta3.paradas.slice(indexT2, indexDestino + 1).length
                      });
                    }
                  }
                }
                if (combinacionesProbadas > maxCombinaciones) break;
              }
              if (combinacionesProbadas > maxCombinaciones) break;
            }
            if (combinacionesProbadas > maxCombinaciones) break;
          }
          if (combinacionesProbadas > maxCombinaciones) break;
        }
        if (combinacionesProbadas > maxCombinaciones) break;
      }
      
      // Ordenar por tiempo y tomar las mejores 5
      transbordos2.sort((a, b) => a.tiempoEstimadoMinutos - b.tiempoEstimadoMinutos);
      recomendaciones.push(...transbordos2.slice(0, 5));
      
      console.log(`✅ Encontradas ${transbordos2.length} rutas con 2 transbordos (probadas ${combinacionesProbadas} combinaciones)`);
    }
    
    // Ordenar todas las recomendaciones: primero por número de transbordos, luego por tiempo
    recomendaciones.sort((a, b) => {
      if (a.transbordos !== b.transbordos) {
        return a.transbordos - b.transbordos; // Menos transbordos primero
      }
      return a.tiempoEstimadoMinutos - b.tiempoEstimadoMinutos; // Luego por tiempo
    });
    
    const rutasDirectasCount = recomendaciones.filter(r => r.tipo === 'directa').length;
    const rutasTransbordoCount = recomendaciones.filter(r => r.tipo === 'transbordo').length;
    
    // Si no se encontraron rutas, sugerir paradas hub cercanas
    if (recomendaciones.length === 0) {
      const paradasHub = await pool.query(`
        SELECT p.*, COUNT(DISTINCT pr.id_ruta) as num_rutas,
               CASE p.tipo
                 WHEN 'Terminal' THEN 5
                 WHEN 'TransferHub' THEN 4
                 ELSE 1
               END as prioridad
        FROM paradas p
        LEFT JOIN parada_ruta pr ON p.id = pr.id_parada
        WHERE p.activa = 1
        GROUP BY p.id
        HAVING num_rutas >= 2
        ORDER BY prioridad DESC, num_rutas DESC
        LIMIT 10
      `);
      
      const sugerenciasOrigen = paradasHub.rows.map(p => ({
        ...p,
        distancia: calcularDistancia(latInicio, lngInicio, parseFloat(p.latitud), parseFloat(p.longitud))
      })).sort((a, b) => a.distancia - b.distancia).slice(0, 5);
      
      const sugerenciasDestino = paradasHub.rows.map(p => ({
        ...p,
        distancia: calcularDistancia(latDestino, lngDestino, parseFloat(p.latitud), parseFloat(p.longitud))
      })).sort((a, b) => a.distancia - b.distancia).slice(0, 5);
      
      return res.json({
        exito: false,
        mensaje: "No se encontraron rutas disponibles. Prueba con estas paradas cercanas con más conexiones:",
        origen: { lat: latInicio, lng: lngInicio },
        destino: { lat: latDestino, lng: lngDestino },
        paradasOrigen: paradasOrigen.map(p => ({ ...p, distancia_metros: Math.round(p.distancia) })),
        paradasDestino: paradasDestino.map(p => ({ ...p, distancia_metros: Math.round(p.distancia) })),
        sugerenciasOrigen: sugerenciasOrigen.map(p => ({ 
          ...p, 
          distancia_metros: Math.round(p.distancia),
          distancia_km: (p.distancia / 1000).toFixed(2)
        })),
        sugerenciasDestino: sugerenciasDestino.map(p => ({ 
          ...p, 
          distancia_metros: Math.round(p.distancia),
          distancia_km: (p.distancia / 1000).toFixed(2)
        })),
        recomendaciones: []
      });
    }
    
    res.json({
      exito: true,
      mensaje: `Se encontraron ${recomendaciones.length} opciones`,
      origen: { lat: latInicio, lng: lngInicio },
      destino: { lat: latDestino, lng: lngDestino },
      paradasOrigen: paradasOrigen.map(p => ({ ...p, distancia_metros: Math.round(p.distancia) })),
      paradasDestino: paradasDestino.map(p => ({ ...p, distancia_metros: Math.round(p.distancia) })),
      recomendaciones: recomendaciones.slice(0, 15), // Hasta 15 opciones (antes 10)
      estadisticas: {
        total_opciones: recomendaciones.length,
        rutas_directas: rutasDirectasCount,
        rutas_con_transbordo: rutasTransbordoCount,
        tiempo_promedio_minutos: recomendaciones.length > 0 
          ? Math.round(recomendaciones.reduce((sum, r) => sum + (r.tiempoEstimadoMinutos || 0), 0) / recomendaciones.length)
          : 0
      }
    });
  } catch (err) {
    console.error("Error al recomendar ruta:", err);
    res.status(500).json({
      success: false,
      message: "Error al recomendar ruta",
      error: err.message
    });
  }
});

// Buscar rutas entre dos paradas (endpoint legacy - mantener por compatibilidad)
app.post("/api/buscar-rutas", async (req, res) => {
  const { paradaOrigenId, paradaDestinoId } = req.body;
  
  if (!paradaOrigenId || !paradaDestinoId) {
    return res.status(400).json({ 
      success: false,
      message: "Se requieren los IDs de origen y destino" 
    });
  }
  
  try {
    // Obtener info de las paradas
    const paradaOrigen = await pool.query(
      "SELECT * FROM paradas WHERE id = $1",
      [paradaOrigenId]
    );
    
    const paradaDestino = await pool.query(
      "SELECT * FROM paradas WHERE id = $1",
      [paradaDestinoId]
    );
    
    if (paradaOrigen.rows.length === 0 || paradaDestino.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paradas no encontradas"
      });
    }
    
    // Buscar rutas directas (una sola ruta que conecte ambas paradas)
    const rutasDirectas = await pool.query(`
      SELECT DISTINCT
        r.id,
        r.numero_ruta,
        r.nombre,
        r.empresa,
        r.tipo,
        r.tarifa,
        pr1.id_parada as parada_origen_id,
        p1.nombre as parada_origen_nombre,
        p1.latitud as parada_origen_lat,
        p1.longitud as parada_origen_lng,
        pr1.orden as orden_origen,
        pr1.tiempo_estimado_minutos as tiempo_origen,
        pr2.id_parada as parada_destino_id,
        p2.nombre as parada_destino_nombre,
        p2.latitud as parada_destino_lat,
        p2.longitud as parada_destino_lng,
        pr2.orden as orden_destino,
        pr2.tiempo_estimado_minutos as tiempo_destino
      FROM rutas r
      JOIN parada_ruta pr1 ON r.id = pr1.id_ruta
      JOIN parada_ruta pr2 ON r.id = pr2.id_ruta
      JOIN paradas p1 ON pr1.id_parada = p1.id
      JOIN paradas p2 ON pr2.id_parada = p2.id
      WHERE r.activa = 1
        AND pr1.id_parada = $1
        AND pr2.id_parada = $2
        AND pr1.orden < pr2.orden
      ORDER BY (pr2.tiempo_estimado_minutos - pr1.tiempo_estimado_minutos) ASC
    `, [paradaOrigenId, paradaDestinoId]);
    
    // Calcular distancia en línea recta (fórmula de Haversine simplificada)
    const lat1 = parseFloat(paradaOrigen.rows[0].latitud);
    const lon1 = parseFloat(paradaOrigen.rows[0].longitud);
    const lat2 = parseFloat(paradaDestino.rows[0].latitud);
    const lon2 = parseFloat(paradaDestino.rows[0].longitud);
    
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanciaKm = R * c;
    
    // Para cada ruta, obtener las paradas intermedias
    const rutasConParadas = [];
    for (const ruta of rutasDirectas.rows) {
      const paradasIntermedias = await pool.query(`
        SELECT 
          p.id, p.codigo, p.nombre, p.latitud, p.longitud, 
          pr.orden, pr.tiempo_estimado_minutos
        FROM paradas p
        JOIN parada_ruta pr ON p.id = pr.id_parada
        WHERE pr.id_ruta = $1 
          AND pr.orden >= $2 
          AND pr.orden <= $3
        ORDER BY pr.orden
      `, [ruta.id, ruta.orden_origen, ruta.orden_destino]);
      
      rutasConParadas.push({
        ruta: {
          id: ruta.id,
          numero_ruta: ruta.numero_ruta,
          nombre: ruta.nombre,
          empresa: ruta.empresa,
          tipo: ruta.tipo,
          tarifa: parseFloat(ruta.tarifa)
        },
        paradaOrigen: {
          id: ruta.parada_origen_id,
          nombre: ruta.parada_origen_nombre,
          latitud: parseFloat(ruta.parada_origen_lat),
          longitud: parseFloat(ruta.parada_origen_lng)
        },
        paradaDestino: {
          id: ruta.parada_destino_id,
          nombre: ruta.parada_destino_nombre,
          latitud: parseFloat(ruta.parada_destino_lat),
          longitud: parseFloat(ruta.parada_destino_lng)
        },
        paradasIntermedias: paradasIntermedias.rows.map(p => ({
          id: p.id,
          codigo: p.codigo,
          nombre: p.nombre,
          latitud: parseFloat(p.latitud),
          longitud: parseFloat(p.longitud),
          orden: p.orden
        })),
        tiempoEstimadoMinutos: ruta.tiempo_destino - ruta.tiempo_origen,
        numeroParadas: paradasIntermedias.rows.length
      });
    }
    
    res.json({
      success: true,
      origen: paradaOrigen.rows[0],
      destino: paradaDestino.rows[0],
      distanciaLineaRecta: distanciaKm.toFixed(2),
      rutasDisponibles: rutasConParadas,
      totalRutas: rutasConParadas.length
    });
    
  } catch (err) {
    console.error("Error al buscar rutas:", err);
    res.status(500).json({
      success: false,
      message: "Error al buscar rutas",
      error: err.message
    });
  }
});

// ===============================
// 🔹 RUTAS DE HISTORIAL (SIMPLIFICADO)
// ===============================

// Guardar búsqueda en el historial
app.post("/historial", authenticateToken, async (req, res) => {
  const { ruta, numero_ruta, parada } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO historial_busquedas (id_usuario, ruta, numero_ruta, parada)
       VALUES ($1, $2, $3, $4)
       RETURNING id, fecha_busqueda`,
      [req.user.id, ruta || null, numero_ruta || null, parada || null]
    );
    
    res.status(201).json({
      message: "Búsqueda guardada en el historial",
      id: result.rows[0].id,
      fecha: result.rows[0].fecha_busqueda
    });
  } catch (err) {
    console.error("Error al guardar historial:", err);
    res.status(500).json({ message: "Error al guardar historial" });
  }
});

// Obtener historial de búsquedas del usuario
app.get("/historial", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ruta, numero_ruta, parada, fecha_busqueda
       FROM historial_busquedas
       WHERE id_usuario = $1
       ORDER BY fecha_busqueda DESC
       LIMIT 20`,
      [req.user.id]
    );
    
    res.json({
      historial: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error("Error al obtener historial:", err);
    res.json({ historial: [], total: 0 });
  }
});

// Eliminar una búsqueda del historial
app.delete("/historial/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM historial_busquedas WHERE id = $1 AND id_usuario = $2 RETURNING id",
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Búsqueda no encontrada" });
    }
    
    res.json({ message: "Búsqueda eliminada del historial" });
  } catch (err) {
    console.error("Error al eliminar del historial:", err);
    res.status(500).json({ message: "Error al eliminar del historial" });
  }
});

// Limpiar todo el historial del usuario
app.delete("/historial", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM historial_busquedas WHERE id_usuario = $1",
      [req.user.id]
    );
    
    res.json({ message: "Historial limpiado exitosamente" });
  } catch (err) {
    console.error("Error al limpiar historial:", err);
    res.status(500).json({ message: "Error al limpiar historial" });
  }
});

// ===============================
// 🔹 RUTAS DE PRUEBA
// ===============================

// Endpoint de prueba en la raíz
app.get("/", (req, res) => {
  res.json({
    message: "Backend BusTrackSV funcionando ✅",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: "SQLite"
  });
});

// Endpoint de salud del servidor
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// 🔹 INICIAR SERVIDOR
// ===============================
const startServer = async () => {
  try {
    // Probar conexión a la base de datos antes de iniciar el servidor
    console.log('🔄 Probando conexión a la base de datos...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos.');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor BusTrackSV corriendo en http://localhost:${PORT}`);
      console.log(`📊 Puerto: ${PORT}`);
      console.log(`💾 Base de datos: SQLite`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
