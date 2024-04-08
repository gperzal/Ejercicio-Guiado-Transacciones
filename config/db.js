import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Formato de la cadena de conexión
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// Crear la instancia de Pool usando la cadena de conexión
const pool = new Pool({
    connectionString,
    allowExitOnIdle: true
});

export default pool;
