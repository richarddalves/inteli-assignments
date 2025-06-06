// Arquivo principal de rotas que agrupa todos os endpoints da API
const express = require("express");
const router = express.Router();
const path = require("path");
const { isAuthenticated } = require("../controllers/authMiddleware");
const reservaRepository = require("../repositories/ReservaRepository");

// Importando as rotas
const usuariosRoutes = require("./usuarios");
const reservasRoutes = require("./reservas");
const authRoutes = require("./auth");

// Rota principal que serve a página inicial
router.get("/", async (req, res) => {
  try {
    const stats = await reservaRepository.getStats();
    res.render("pages/index", {
      title: "Início - Sistema de Reserva de Salas",
      user: req.session.user || null,
      stats,
    });
  } catch (error) {
    console.error("Erro ao carregar página inicial:", error);
    res.status(500).render("error", {
      message: "Erro ao carregar página inicial",
      error: error.message,
    });
  }
});

// Rota para o formulário de reserva
router.get("/reservar/:roomId", isAuthenticated, (req, res) => {
  res.render("pages/formulario-reserva", {
    title: "Reservar Sala",
    roomId: req.params.roomId,
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
router.use("/usuarios", isAuthenticated, usuariosRoutes);
router.use("/reservas", isAuthenticated, reservasRoutes);
router.use("/auth", authRoutes);

// Exportando o router como um middleware Express
module.exports = router;
