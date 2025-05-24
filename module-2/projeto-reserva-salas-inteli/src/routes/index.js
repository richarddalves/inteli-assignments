// Arquivo principal de rotas que agrupa todos os endpoints da API
const express = require("express");
const router = express.Router();
const path = require("path");

// Importando as rotas
const usuariosRoutes = require("./usuarios");
const salasRoutes = require("./salas");
const reservasRoutes = require("./reservas");
const tiposSalaRoutes = require("./tipos-sala");

// Rota principal que serve a página inicial
router.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Sistema de Reserva de Salas",
    message: "Bem-vindo ao Sistema de Reserva de Salas",
  });
});

// Rota para a documentação da API
router.get("/documentacao", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/pages/documentacao.html"));
});

// Rota de status
router.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Rota de teste de conexão com o banco
router.get("/test-db", async (req, res) => {
  try {
    const db = require("../config/db");
    await db.query("SELECT NOW()");
    res.json({
      status: "success",
      message: "Conexão com o banco de dados estabelecida com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Erro ao conectar com o banco de dados",
      error: error.message,
    });
  }
});

// Registrando as rotas da API
router.use("/usuarios", usuariosRoutes);
router.use("/salas", salasRoutes);
router.use("/reservas", reservasRoutes);
router.use("/tipos-sala", tiposSalaRoutes);

// Exportando o router como um middleware Express
module.exports = router;
