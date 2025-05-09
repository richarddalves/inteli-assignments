const express = require("express");
const router = express.Router();
const db = require("../config/database.js");

// Rota básica para teste
router.get("/", async (req, res) => {
  try {
    const query_result = await db.query("SELECT NOW()");
    res.send(
      `Bem-vindo ao Sistema de Reserva de Salas do Inteli<br>
      Hora no banco de dados: ${query_result.rows[0].now}`
    );
  } catch (err) {
    res.status(500).send(`Erro ao conectar com o banco\nErro: ${err}`);
  }
});

// Exportando o router como um middleware Express
module.exports = router;
