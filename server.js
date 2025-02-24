require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
  } else {
    console.log('Conectado a MySQL en Clever Cloud 🚀');
  }
});

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('API funcionando');
});



// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT} 🚀`));
