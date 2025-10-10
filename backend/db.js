import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // máximo de conexiones
  idleTimeoutMillis: 30000, // 30 seg para cerrar conexiones inactivas
  connectionTimeoutMillis: 2000 // espera hasta 2 seg para conectarse
});

pool.on('error', (err) => {
  console.error('Error inesperado en cliente idle', err);
  process.exit(-1);
});
