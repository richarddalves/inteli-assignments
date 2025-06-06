const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/ReservaController");
const { isAuthenticated } = require("../controllers/authMiddleware");
const reservaRepository = require("../repositories/ReservaRepository");

// Listar todas as reservas
router.get("/", async (req, res) => {
  try {
    const reservas = await ReservaController.getReservasByUser(
      req.session.user.user_id
    );
    res.render("pages/minhas-reservas", {
      title: "Minhas Reservas",
      reservas,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    res.status(500).render("error", {
      message: "Erro ao listar reservas",
      error: error.message,
    });
  }
});

// Rota para ver minhas reservas
router.get("/minhas", isAuthenticated, async (req, res) => {
  try {
    const reservas = await ReservaController.getReservasByUser(
      req.session.user.user_id
    );
    res.render("pages/minhas-reservas", {
      title: "Minhas Reservas",
      reservas,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Erro ao buscar minhas reservas:", error);
    res.status(500).render("error", {
      message: "Erro ao buscar minhas reservas",
      error: error.message,
    });
  }
});

// Rota para criar nova reserva
router.get("/nova", isAuthenticated, async (req, res) => {
  try {
    const rooms = await reservaRepository.findAll();
    res.render("pages/formulario-reserva", {
      roomId: null,
      rooms,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    res.status(500).render("error", {
      message: "Erro ao buscar salas",
      error: error.message,
    });
  }
});

// Rota para verificar disponibilidade das salas
router.post("/check-availability", isAuthenticated, async (req, res) => {
  try {
    const { start_time, end_time } = req.body;
    const availability = await ReservaController.checkRoomAvailability(
      start_time,
      end_time
    );
    res.json(availability);
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    res.status(500).json({ error: "Erro ao verificar disponibilidade" });
  }
});

// Rota para criar uma nova reserva
router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log("Recebendo requisição de criação de reserva");
    console.log("Body:", req.body);
    console.log("Session:", req.session);

    const { room_id, start_time, end_time, reason } = req.body;
    const userId = req.session.user.user_id;

    console.log("Dados da reserva:", {
      userId,
      room_id,
      start_time,
      end_time,
      reason,
    });

    if (!userId) {
      console.log("Usuário não autenticado");
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!room_id || !start_time || !end_time) {
      console.log("Dados incompletos:", { room_id, start_time, end_time });
      return res
        .status(400)
        .json({ message: "Dados incompletos para criar a reserva" });
    }

    console.log("Chamando ReservaController.createReserva");
    const result = await ReservaController.createReserva(
      userId,
      room_id,
      start_time,
      end_time,
      reason
    );

    console.log("Resultado da criação:", result);

    if (!result) {
      console.log("Erro: resultado vazio");
      return res.status(500).json({ message: "Erro ao criar reserva" });
    }

    console.log("Reserva criada com sucesso");
    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({ message: error.message || "Erro ao criar reserva" });
  }
});

// Buscar reservas por usuário
router.get("/usuario/:user_id", async (req, res) => {
  try {
    const reservas = await ReservaController.getReservasByUser(
      req.params.user_id
    );
    res.json({ reservas });
  } catch (error) {
    console.error("Erro ao buscar reservas do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar reservas do usuário" });
  }
});

// Buscar reservas por sala
router.get("/sala/:room_id", async (req, res) => {
  try {
    const reservas = await ReservaController.getReservasByUser(
      req.params.room_id
    );
    res.json({ reservas });
  } catch (error) {
    console.error("Erro ao buscar reservas da sala:", error);
    res.status(500).json({ error: "Erro ao buscar reservas da sala" });
  }
});

// Buscar reserva por ID
router.get("/:booking_id", isAuthenticated, async (req, res) => {
  try {
    const reserva = await ReservaController.getReservasByUser(
      req.params.booking_id
    );
    if (!reserva) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    res.status(500).json({ error: "Erro ao buscar reserva" });
  }
});

// Atualizar reserva
router.put("/:booking_id", isAuthenticated, async (req, res) => {
  try {
    const { start_time, end_time, reason } = req.body;
    const result = await ReservaController.createReserva(
      req.session.user.user_id,
      req.params.booking_id,
      start_time,
      end_time,
      reason
    );
    res.json(result);
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    res.status(500).json({ message: error.message });
  }
});

// Deletar reserva
router.delete("/:booking_id", isAuthenticated, async (req, res) => {
  try {
    await ReservaController.cancelReserva(req.params.booking_id);
    res.json({ message: "Reserva cancelada com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
