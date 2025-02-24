const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = "SELECT * FROM user WHERE username = ?";
  
  db.query(sql, [user], async (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSQL = "INSERT INTO user (username, password) VALUES (?, ?)";
      
      db.query(insertSQL, [user, hashedPassword], (err, result) => {
        if (err) {
          console.error("Error al insertar usuario:", err);
          return res.status(500).json({ error: "Error al registrar usuario" });
        }
        return res.status(201).json({ message: "Usuario registrado con éxito" });
      });
    } catch (error) {
      console.error("Error al encriptar la contraseña:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  });
});

router.post('/login', (req, res) => {
  const { user, password } = req.body;

  // Validar que los datos no estén vacíos
  if (!user || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sql = "SELECT * FROM user WHERE username = ?";
  
  db.query(sql, [user], async (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const userRecord = results[0];

    // Comparar contraseña encriptada
    const match = await bcrypt.compare(password, userRecord.password);
    if (!match) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    return res.status(200).json({ message: "Inicio de sesión exitoso" });
  });
});

module.exports = router;
