const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/ReservaController");

// Listar todas as reservas
router.get("/", reservaController.listarReservas);

// Buscar reserva por ID
router.get("/:booking_id", reservaController.buscarReserva);

// Buscar reservas por usuário
router.get("/usuario/:user_id", reservaController.buscarReservasPorUsuario);

// Buscar reservas por sala
router.get("/sala/:room_id", reservaController.buscarReservasPorSala);

// Criar nova reserva
router.post("/", reservaController.criarReserva);

// Atualizar reserva
router.put("/:booking_id", reservaController.atualizarReserva);

// Atualizar status da reserva
router.patch("/:booking_id/status", reservaController.atualizarStatus);

// Deletar reserva
router.delete("/:booking_id", reservaController.deletarReserva);

module.exports = router;
 