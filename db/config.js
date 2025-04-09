import pg from "pg";
import "dotenv/config";

console.log("Database Config:");
console.log({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS ? "(Hidden for security)" : "Undefined or Empty!",
    port: process.env.DB_PORT
});


const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

export default pool;