
import { pool } from "./server/src/db.js";

async function check() {
    try {
        const result = await pool.query("SELECT id, numero_ruta, geometry FROM rutas WHERE geometry IS NOT NULL LIMIT 5");
        console.log("Rutas con geometría:", result.rows.length);
        if (result.rows.length > 0) {
            console.log("Ejemplo de geometría:", result.rows[0].geometry.substring(0, 100) + "...");
        } else {
            console.log("No hay rutas con geometría.");
        }
    } catch (err) {
        console.error(err);
    }
}

check();
