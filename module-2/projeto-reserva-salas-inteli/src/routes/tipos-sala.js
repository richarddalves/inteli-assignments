// Rotas relacionadas aos tipos de sala
const express = require("express");
const router = express.Router();
const tipoSalaController = require("../controllers/TipoSalaController");

// Lista todos os tipos de sala
router.get("/", tipoSalaController.listarTiposSala);

// Busca um tipo de sala específico
router.get("/:room_type_id", tipoSalaController.buscarTipoSala);

// Cria um novo tipo de sala
router.post("/", tipoSalaController.criarTipoSala);

// Atualiza um tipo de sala existente
router.put("/:room_type_id", tipoSalaController.atualizarTipoSala);

// Remove um tipo de sala
router.delete("/:room_type_id", tipoSalaController.deletarTipoSala);

// Atualiza o status de um tipo de sala
router.patch("/:room_type_id/status", tipoSalaController.atualizarStatus);

module.exports = router;
