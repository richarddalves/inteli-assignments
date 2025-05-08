const express = require("express");
const router = express.Router();

// Rota básica para teste
router.get("/", (req, res) => {
  res.send("Bem-vindo ao Sistema de Reserva de Salas do Inteli");
});

// Exportando o router como um middleware Express
module.exports = router;
