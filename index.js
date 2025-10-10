import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Mostrar todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario, rol, fecha_creacion FROM usuarios"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// 🔹 Registrar usuario
app.post("/register", async (req, res) => {
  const { usuario, password, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (usuario, password, rol) VALUES ($1, $2, $3)",
      [usuario, hashedPassword, rol]
    );
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// 🔹 Login
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
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 4000;
// 🔹 Validar token
app.get("/validate", async (req, res) => {
  const authHeader = req.headers.authorization;

  // Si no viene el token en los headers
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // El token viene así: "Bearer eyJhbGciOi..."
  const token = authHeader.split(" ")[1];

  try {
    // Verificamos que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscamos al usuario en la base de datos
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      decoded.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si todo bien, respondemos con los datos del usuario
    const user = result.rows[0];
    res.json({
      message: "Token válido",
      usuario: user.usuario,
      id: user.id,
    });
  } catch (err) {
    console.error("Error al validar token:", err.message);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));


