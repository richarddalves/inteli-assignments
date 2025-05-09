// ./server.js

const express = require("express");
const db = require("./config/database.js");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// app.get("/", async(req));

// Rotas
const routes = require("./routes/index");
app.use("/", routes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
