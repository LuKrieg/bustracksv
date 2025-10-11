
import { pool } from './db.js';

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ DB conectada:', res.rows[0]);
  } catch (err) {
    console.error('❌ Error conectando a la DB:', err.message);
  } finally {
    pool.end();
  }
};
