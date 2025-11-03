import express from "express";
import cors from "cors";
import { pool } from "./database.js";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a la base de datos exitosa");
    connection.release(); // liberar la conexión al pool
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    process.exit(1); // cortar la app si no hay conexión
  }
}

testDBConnection();

// Login validando en la base
app.post("/login", async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    // Buscar usuario por nombre
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ ok: false, message: "Usuario o contraseña incorrectos" });
    }
    const user = rows[0];
    // Comparar contraseña ingresada con el hash almacenado
    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (match) {
      res.json({ ok: true, message: "Login exitoso", rol: user.rol });
    } else {
      res
        .status(401)
        .json({ ok: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ ok: false, message: "Error del servidor" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.json({ message: "Sesión cerrada" });
});
app.post("/nuevo_prestamo", async (req, res) => {
  const {
    apellido,
    curso,
    numeros_maquinas, // ahora es un string JSON
    total,
    cargador,
    hdmi,
    hora_ing,
    id_lista,
  } = req.body;
  try {
    // Eliminar el campo 'carro', solo guardar numeros_maquinas (JSON string)
    const [result] = await pool.query(
      `INSERT INTO registros (apellido, curso, numeros_maquinas, total, cargador, hdmi, hora_ing, id_lista)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        apellido,
        curso,
        numeros_maquinas,
        total,
        cargador,
        hdmi,
        hora_ing,
        id_lista,
      ]
    );
    res
      .status(201)
      .json({ message: "Préstamo registrado", id: result.insertId });
  } catch (err) {
    console.error("Error al registrar préstamo:", err);
    res.status(500).json({ error: "Error al registrar préstamo" });
  }
});
app.post("/api/agregarlista", async (req, res) => {
  const { nombre, fecha } = req.body;
  console.log("Datos recibidos:", { nombre, fecha });

  try {
    const [result] = await pool.query(
      "INSERT INTO listas (nombre, fecha) VALUES (?, ?)",
      [nombre, fecha]
    );
    res.status(201).json({ message: "Lista agregada", id: result.insertId });
  } catch (err) {
    console.error("Error al agregar lista:", err);
    res.status(500).json({ error: "Error al agregar lista" });
  }
});
app.delete("/api/listas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM listas WHERE id_lista = ?", [id]);
    res.json({ message: "Lista eliminada" });
  } catch (err) {
    console.error("Error al eliminar lista:", err);
    res.status(500).json({ error: "Error al eliminar lista" });
  }
});
app.get("/api/listas", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_lista, nombre, fecha FROM listas ORDER BY id_lista DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener listas" });
  }
});
app.get("/api/prestamos/:id_lista", async (req, res) => {
  const { id_lista } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM registros WHERE id_lista = ? ORDER BY id DESC",
      [id_lista]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener préstamos" });
  }
});
// Eliminar un prestamo por id
app.delete("/api/prestamos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM registros WHERE id = ?", [id]);
    res.json({ message: "Préstamo eliminado" });
  } catch (err) {
    console.error("Error al eliminar préstamo:", err.message);
    res.status(500).json({ error: "Error al eliminar préstamo" });
  }
});

// Marcar prestamo como devuelto (establece hora_dev y devueltas = 1)
app.put("/api/prestamos/:id/completar", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE registros SET hora_dev = NOW(), devueltas = 1 WHERE id = ?",
      [id]
    );
    res.json({ message: "Préstamo marcado como devuelto" });
  } catch (err) {
    console.error("Error al marcar préstamo como devuelto:", err.message);
    res.status(500).json({ error: "Error al actualizar préstamo" });
  }
});

// Alternar estado devuelto: si está devuelto -> desmarcar (hora_dev = NULL, devueltas = 0), si no -> marcar con NOW()
app.put("/api/prestamos/:id/toggle_devuelto", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT devueltas FROM registros WHERE id = ?",
      [id]
    );
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "No encontrado" });
    const current = rows[0].devueltas;
    if (current === 1) {
      await pool.query(
        "UPDATE registros SET hora_dev = NULL, devueltas = 0 WHERE id = ?",
        [id]
      );
      return res.json({ message: "Préstamo desmarcado como devuelto" });
    } else {
      await pool.query(
        "UPDATE registros SET hora_dev = NOW(), devueltas = 1 WHERE id = ?",
        [id]
      );
      return res.json({ message: "Préstamo marcado como devuelto" });
    }
  } catch (err) {
    console.error("Error al alternar devuelto:", err.message);
    res.status(500).json({ error: "Error al alternar devuelto" });
  }
});
// Endpoint para registrar usuario desde el panel admin
// Endpoint para obtener todos los usuarios registrados
app.get("/api/usuarios", async (req, res) => {
  try {
    // Excluir los usuarios 'anderson' y 'el secreto'
    const [rows] = await pool.query(
      "SELECT id, usuario, rol FROM usuarios WHERE usuario NOT IN (?, ?) ORDER BY id ASC",
      ["anderson", "el secreto"]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.post("/registrar_usuario", async (req, res) => {
  const { usuario, contraseña, rol = "user" } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  try {
    // Validar que no exista el usuario
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = ?",
      [usuario]
    );
    if (rows.length > 0) {
      return res
        .status(409)
        .json({ error: `El usuario '${usuario}' ya existe.` });
    }
    const hash = await bcrypt.hash(contraseña, 10);
    await pool.query(
      "INSERT INTO usuarios (usuario, contraseña, rol) VALUES (?, ?, ?)",
      [usuario, hash, rol]
    );
    res.status(201).json({
      message: `Usuario '${usuario}' registrado correctamente con rol '${rol}'.`,
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});
// Eliminar usuario por ID
app.delete("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err.message);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Actualizar usuario por ID (usuario y rol)
app.put("/api/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { usuario, rol } = req.body;
  if (!usuario || !rol) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  try {
    await pool.query("UPDATE usuarios SET usuario = ?, rol = ? WHERE id = ?", [
      usuario,
      rol,
      id,
    ]);
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar usuario:", err.message);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});
// Actualizar un prestamo por id
app.put("/api/prestamos/:id", async (req, res) => {
  const { id } = req.params;
  const { apellido, curso, numeros_maquinas, total, cargador, hdmi, hora_ing } =
    req.body;
  try {
    await pool.query(
      `UPDATE registros SET apellido = ?, curso = ?, numeros_maquinas = ?, total = ?, cargador = ?, hdmi = ?, hora_ing = ? WHERE id = ?`,
      [apellido, curso, numeros_maquinas, total, cargador, hdmi, hora_ing, id]
    );
    res.json({ message: "Préstamo actualizado" });
  } catch (err) {
    console.error("Error al actualizar préstamo:", err.message);
    res.status(500).json({ error: "Error al actualizar préstamo" });
  }
});
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
