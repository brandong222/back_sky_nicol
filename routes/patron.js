const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', (req, res) => {
  const { image_link, video_link, title, description, type, user_id } = req.body;

  if (!title || !type || !user_id) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const sql = "INSERT INTO patron (image_link, video_link, title, description, type, user_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [image_link, video_link, title, description, type, user_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al insertar patrón:", err);
      return res.status(500).json({ error: "Error al registrar el patrón" });
    }

    res.status(201).json({ message: "Patrón creado con éxito", patron_id: result.insertId });
  });
});

router.get('/search/:query', (req, res) => {
    const { query } = req.params;
  
    const sql = "SELECT * FROM patron WHERE title LIKE ?";
    const searchTerm = `%${query}%`; // Permite buscar en cualquier parte del título
  
    db.query(sql, [searchTerm], (err, results) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "No se encontraron patrones" });
      }
  
      res.json(results);
    });
  });

  router.get('/', (req, res) => {
    const sql = "SELECT * FROM patron";
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "No hay patrones registrados" });
      }
  
      res.json(results);
    });
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { image_link, video_link, title, description, type, user_id } = req.body;
  
    if (!title || !type || !user_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    const sql = "UPDATE patron SET image_link = ?, video_link = ?, title = ?, description = ?, type = ?, user_id = ? WHERE id = ?";
    const values = [image_link, video_link, title, description, type, user_id, id];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar el patrón:", err);
        return res.status(500).json({ error: "Error al actualizar el patrón" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Patrón no encontrado" });
      }
  
      res.json({ message: "Patrón actualizado con éxito" });
    });
  });
  
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = "DELETE FROM patron WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error al eliminar el patrón:", err);
        return res.status(500).json({ error: "Error al eliminar el patrón" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Patrón no encontrado" });
      }
  
      res.json({ message: "Patrón eliminado con éxito" });
    });
  });
  
  
  

module.exports = router;
