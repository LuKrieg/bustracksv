import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

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
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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
  const { usuario, password } = req.body;

  try {
    // Verificar que el usuario no exista
    const existingUser = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = $1",
      [usuario]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Hashear password y crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (usuario, password) VALUES ($1, $2)",
      [usuario, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
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

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: user.usuario,
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
// 🔹 RUTAS DE USUARIOS
// ===============================

// Obtener todos los usuarios
app.get("/usuarios", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
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
app.listen(PORT, () => {
  console.log(`✅ Servidor BusTrackSV corriendo en http://localhost:${PORT}`);
  console.log(`📊 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});
