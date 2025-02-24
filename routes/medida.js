const express = require('express');
const router = express.Router();
const db = require('../database');

//optener todas

router.get('/medidas', (req, res) => {
    const sql = "SELECT * FROM medida";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener medidas:", err);
        return res.status(500).json({ error: "Error en el servidor al obtener medidas" });
      }
      res.json(results);
    });
  });


  
// Buscar medida por ID
router.get('/medidas/id/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM medida WHERE id = ?";
  db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      if (result.length === 0) return res.status(404).json({ error: "Medida no encontrada" });
      res.json(result[0]);
  });
});

// Buscar medida por nombre
router.get('/medidas/name/:name', (req, res) => {
  const { name } = req.params;
  const sql = "SELECT * FROM medida WHERE LOWER(name) = LOWER(?)";
  db.query(sql, [name], (err, result) => {
      if (err) return res.status(500).json({ error: "Error en la base de datos" });
      if (result.length === 0) return res.status(404).json({ error: "Medida no encontrada" });
      res.json(result[0]);
  });
});

  
  // Crear una nueva medida
  router.post('/medidas', (req, res) => {
    const { name, spanish, english, portuguese } = req.body;
  
    if (!name || !spanish || !english || !portuguese) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const sql = "INSERT INTO medida (name, spanish, english, portuguese) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, spanish, english, portuguese], (err, result) => {
      if (err) {
        console.error("Error al insertar la medida:", err);
        return res.status(500).json({ error: "Error en el servidor al registrar la medida" });
      }
      res.status(201).json({ message: "Medida registrada con éxito", id: result.insertId });
    });
  });
  
  // Actualizar una medida por ID
  router.put('/medidas/:id', (req, res) => {
    const { id } = req.params;
    const { name, spanish, english, portuguese } = req.body;
  
    if (!name || !spanish || !english || !portuguese) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const sql = "UPDATE medida SET name = ?, spanish = ?, english = ?, portuguese = ? WHERE id = ?";
    db.query(sql, [name, spanish, english, portuguese, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar la medida:", err);
        return res.status(500).json({ error: "Error en el servidor al actualizar la medida" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Medida no encontrada" });
      }
      res.json({ message: "Medida actualizada con éxito" });
    });
  });
  
  // Eliminar una medida por ID
  router.delete('/medidas/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM medida WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar la medida:", err);
        return res.status(500).json({ error: "Error en el servidor al eliminar la medida" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Medida no encontrada" });
      }
      res.json({ message: "Medida eliminada con éxito" });
    });
  });


  module.exports = router;