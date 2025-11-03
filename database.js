import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",     // tu host
  user: "root",    // usuario que ya creaste
  database: "pdcp-sql",   // nombre de la base de datos
});