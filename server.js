require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user");
const medidaRoutes = require('./routes/medida');
const patronRoutes = require('./routes/patron');
const patron_medida = require('./routes/patron_medida');
const pedidoRoutes = require('./routes/pedido');



const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use('/api', medidaRoutes);
app.use('/api/patrones', patronRoutes);
app.use('/api/patron_medida', patron_medida);
app.use('/api/pedidos', pedidoRoutes);



app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT} 🚀`));
