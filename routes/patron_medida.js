const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', (req, res) => {
    const { patron_id, medida_id } = req.body;
  
    if (!patron_id || !medida_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    const sql = "INSERT INTO patron_medida (patron_id, medida_id) VALUES (?, ?)";
    
    db.query(sql, [patron_id, medida_id], (err, result) => {
      if (err) {
        console.error("Error al agregar relación patrón-medida:", err);
        return res.status(500).json({ error: "Error al agregar relación" });
      }
  
      res.status(201).json({ message: "Relación patrón-medida agregada con éxito" });
    });
  });

  router.delete('/', (req, res) => {
    const { patron_id, medida_id } = req.body;
  
    if (!patron_id || !medida_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    const sql = "DELETE FROM patron_medida WHERE patron_id = ? AND medida_id = ?";
  
    db.query(sql, [patron_id, medida_id], (err, result) => {
      if (err) {
        console.error("Error al eliminar relación patrón-medida:", err);
        return res.status(500).json({ error: "Error al eliminar relación" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Relación no encontrada" });
      }
  
      res.json({ message: "Relación patrón-medida eliminada con éxito" });
    });
  });
  
  


module.exports = router;