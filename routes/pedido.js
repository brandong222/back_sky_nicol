const express = require('express');
const router = express.Router();
const db = require('../database');


router.post('/', (req, res) => {
    const { fecha_pedido, fecha_entrega, status, adelanto, total_pagar, cliente, caracteristicas, patron_id } = req.body;
  
    if (!fecha_pedido || !status || !total_pagar || !cliente) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    const sql = `
      INSERT INTO pedido (fecha_pedido, fecha_entrega, status, adelanto, total_pagar, cliente, caracteristicas, patron_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [fecha_pedido, fecha_entrega || null, status, adelanto || 0, total_pagar, cliente, caracteristicas || null, patron_id || null];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al crear pedido:", err);
        return res.status(500).json({ error: "Error al registrar el pedido" });
      }
  
      res.status(201).json({ message: "Pedido creado con éxito", pedido_id: result.insertId });
    });
  });


  
  router.get('/', (req, res) => {
    const sql = `
      SELECT * FROM pedido 
      ORDER BY DATEDIFF(fecha_entrega, fecha_pedido) ASC, fecha_pedido ASC, fecha_entrega ASC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener pedidos:", err);
        return res.status(500).json({ error: "Error al recuperar pedidos" });
      }
  
      res.json(results);
    });
  });
  
  


  router.get('/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = "SELECT * FROM pedido WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error al obtener pedido:", err);
        return res.status(500).json({ error: "Error al recuperar pedido" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
  
      res.json(result[0]);
    });
  });

  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { fecha_pedido, fecha_entrega, status, adelanto, total_pagar, cliente, caracteristicas, patron_id } = req.body;
  
    // Opciones válidas para 'status'
    const validStatuses = ["pendiente", "en proceso", "entregado", "cancelado"];
  
    // Verificar que el estado esté en la lista de valores permitidos
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado inválido. Usa: 'pendiente', 'en proceso', 'entregado' o 'cancelado'" });
    }
  
    const sql = `
      UPDATE pedido 
      SET fecha_pedido = ?, fecha_entrega = ?, status = ?, adelanto = ?, total_pagar = ?, cliente = ?, caracteristicas = ?, patron_id = ?
      WHERE id = ?
    `;
  
    const values = [fecha_pedido, fecha_entrega, status, adelanto, total_pagar, cliente, caracteristicas, patron_id, id];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al actualizar pedido:", err);
        return res.status(500).json({ error: "Error al actualizar el pedido" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
  
      res.json({ message: "Pedido actualizado con éxito" });
    });
  });
  
  
  router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (status !== "entregado" && status !== "cancelado") {
      return res.status(400).json({ error: "Estado inválido, usa 'entregado' o 'cancelado'" });
    }
  
    const sql = "UPDATE pedido SET status = ? WHERE id = ?";
  
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar estado del pedido:", err);
        return res.status(500).json({ error: "Error al actualizar el estado del pedido" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
  
      res.json({ message: `Pedido actualizado a estado '${status}'` });
    });
  });
  

  router.get('/filtro/total', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
  
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe proporcionar 'fechaInicio' y 'fechaFin'" });
    }
  
    const sql = `
      SELECT SUM(total_pagar) AS total FROM pedido 
      WHERE status = 'entregado' 
      AND fecha_pedido BETWEEN ? AND ?
    `;
  
    db.query(sql, [fechaInicio, fechaFin], (err, result) => {
      if (err) {
        console.error("Error al calcular total:", err);
        return res.status(500).json({ error: "Error al obtener el total" });
      }
  
      res.json({ total: result[0].total || 0 });
    });
  });
  
  

module.exports = router;
