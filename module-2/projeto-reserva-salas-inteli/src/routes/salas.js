// Rotas relacionadas às operações de salas
const express = require("express");
const router = express.Router();
const salaController = require("../controllers/SalaController");

// Listar todas as salas
router.get("/", salaController.listarSalas);

// Buscar sala por ID
router.get("/:room_id", salaController.buscarSala);

// Buscar salas por tipo
router.get("/tipo/:room_type_id", salaController.buscarPorTipo);

// Criar nova sala
router.post("/", salaController.criarSala);

// Atualizar sala
router.put("/:room_id", salaController.atualizarSala);

// Deletar sala
router.delete("/:room_id", salaController.deletarSala);

// Verificar disponibilidade da sala
router.post(
  "/verificar-disponibilidade",
  salaController.verificarDisponibilidade
);

module.exports = router;
