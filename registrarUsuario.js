import bcrypt from "bcrypt";
import { pool } from "./database.js";
// Registrar un usuario ejecutando:
// node registrarUsuario.js <usuario> <contraseña> <rol>

async function registrarUsuario() {
  const [, , usuario, contraseña, rol = "user"] = process.argv;
  if (!usuario || !contraseña) {
    console.log("Uso: node registrarUsuario.js <usuario> <contraseña> [rol]");
    process.exit(1);
  }
  try {
    // Validar que no exista el usuario
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = ?",
      [usuario]
    );
    if (rows.length > 0) {
      console.log(
        `El usuario '${usuario}' ya existe. Elige otro nombre de usuario.`
      );
      process.exit(1);
    }
    const hash = await bcrypt.hash(contraseña, 10);
    await pool.query(
      "INSERT INTO usuarios (usuario, contraseña, rol) VALUES (?, ?, ?)",
      [usuario, hash, rol]
    );
    console.log(`Usuario '${usuario}' registrado correctamente con rol '${rol}'.`);
    process.exit(0);
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    process.exit(1);
  }
}

registrarUsuario();
