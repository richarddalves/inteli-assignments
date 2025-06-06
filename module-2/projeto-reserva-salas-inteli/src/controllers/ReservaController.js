// Controlador responsável pelas operações relacionadas às reservas
const reservaRepository = require("../repositories/ReservaRepository");

class ReservaController {
  // Lista todas as reservas cadastradas
  async listarReservas(req, res) {
    try {
      const reservas = await reservaRepository.findAll();
      res.json({ reservas: reservas.map((r) => (r.toJSON ? r.toJSON() : r)) });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao listar reservas", details: error.message });
    }
  }

  // Busca uma reserva específica pelo ID
  async buscarReserva(req, res) {
    try {
      const reserva = await reservaRepository.findById(req.params.booking_id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }
      const obj = reserva.toJSON ? reserva.toJSON() : reserva;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar reserva", details: error.message });
    }
  }

  // Busca todas as reservas de um usuário específico
  async buscarReservasPorUsuario(req, res) {
    try {
      const reservas = await reservaRepository.findByUsuario(
        req.params.user_id
      );
      res.json({ reservas: reservas.map((r) => (r.toJSON ? r.toJSON() : r)) });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar reservas do usuário",
        details: error.message,
      });
    }
  }

  // Busca todas as reservas de uma sala específica
  async buscarReservasPorSala(req, res) {
    try {
      const reservas = await reservaRepository.findBySala(req.params.room_id);
      res.json({ reservas: reservas.map((r) => (r.toJSON ? r.toJSON() : r)) });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar reservas da sala",
        details: error.message,
      });
    }
  }

  // Cria uma nova reserva no sistema
  async criarReserva(req, res) {
    try {
      const { room_id, user_id, start_time, end_time, reason } = req.body;
      if (!room_id || !user_id || !start_time || !end_time) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }

      // Validar datas
      const inicio = new Date(start_time);
      const fim = new Date(end_time);
      const agora = new Date();

      if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        return res.status(400).json({ error: "Datas inválidas" });
      }

      if (inicio >= fim) {
        return res
          .status(400)
          .json({ error: "A data de início deve ser anterior à data de fim" });
      }

      if (inicio < agora) {
        return res
          .status(400)
          .json({ error: "A data de início deve ser futura" });
      }

      // Verificar se usuário existe e está ativo
      const usuario =
        await require("../repositories/UsuarioRepository").findById(user_id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      if (!usuario.is_active) {
        return res.status(400).json({ error: "Usuário está inativo" });
      }

      // Verificar disponibilidade da sala
      const disponivel = await reservaRepository.checkDisponibilidade(
        room_id,
        start_time,
        end_time
      );
      if (!disponivel) {
        return res
          .status(400)
          .json({ error: "Sala não disponível no horário solicitado" });
      }

      const reserva = await reservaRepository.create({
        room_id,
        user_id,
        start_time,
        end_time,
        status: "reserved",
        reason: reason || null,
      });

      const obj = reserva.toJSON ? reserva.toJSON() : reserva;
      res.status(201).json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao criar reserva", details: error.message });
    }
  }

  // Atualiza os dados de uma reserva existente
  async atualizarReserva(req, res) {
    try {
      const { start_time, end_time, reason, status } = req.body;
      const booking_id = req.params.booking_id;
      const reservaExistente = await reservaRepository.findById(booking_id);
      if (!reservaExistente) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      // Validar datas se fornecidas
      if (start_time || end_time) {
        const inicio = new Date(start_time || reservaExistente.start_time);
        const fim = new Date(end_time || reservaExistente.end_time);
        const agora = new Date();

        if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
          return res.status(400).json({ error: "Datas inválidas" });
        }

        if (inicio >= fim) {
          return res.status(400).json({
            error: "A data de início deve ser anterior à data de fim",
          });
        }

        if (inicio < agora) {
          return res
            .status(400)
            .json({ error: "A data de início deve ser futura" });
        }
      }

      // Se estiver alterando as datas, verificar disponibilidade
      if (
        (start_time && start_time !== reservaExistente.start_time) ||
        (end_time && end_time !== reservaExistente.end_time)
      ) {
        const disponivel = await reservaRepository.checkDisponibilidade(
          reservaExistente.room_id,
          start_time || reservaExistente.start_time,
          end_time || reservaExistente.end_time,
          booking_id // Excluir a própria reserva da verificação
        );
        if (!disponivel) {
          return res
            .status(400)
            .json({ error: "Sala não disponível no horário solicitado" });
        }
      }

      // Validar status se fornecido
      if (
        status &&
        ![
          "reserved",
          "approved",
          "rejected",
          "cancelled",
          "completed",
          "released",
        ].includes(status)
      ) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const dadosAtualizacao = {
        start_time: start_time || reservaExistente.start_time,
        end_time: end_time || reservaExistente.end_time,
        reason: reason !== undefined ? reason : reservaExistente.reason,
        status: status || reservaExistente.status,
      };

      const reservaAtualizada = await reservaRepository.update(
        booking_id,
        dadosAtualizacao
      );

      const obj = reservaAtualizada.toJSON
        ? reservaAtualizada.toJSON()
        : reservaAtualizada;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar reserva", details: error.message });
    }
  }

  // Atualiza apenas o status de uma reserva
  async atualizarStatus(req, res) {
    try {
      const { status } = req.body;
      const booking_id = req.params.booking_id;

      if (
        ![
          "reserved",
          "approved",
          "rejected",
          "cancelled",
          "completed",
          "released",
        ].includes(status)
      ) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const reservaExistente = await reservaRepository.findById(booking_id);
      if (!reservaExistente) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      const reservaAtualizada = await reservaRepository.update(booking_id, {
        status,
      });

      const obj = reservaAtualizada.toJSON
        ? reservaAtualizada.toJSON()
        : reservaAtualizada;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar status", details: error.message });
    }
  }

  // Remove uma reserva do sistema
  async deletarReserva(req, res) {
    try {
      const booking_id = req.params.booking_id;
      const reservaExistente = await reservaRepository.findById(booking_id);
      if (!reservaExistente) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }

      await reservaRepository.delete(booking_id);
      res.json({ message: "Reserva removida com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao deletar reserva", details: error.message });
    }
  }

  // Lista as reservas do usuário logado
  async minhasReservas(req, res) {
    try {
      const reservas = await reservaRepository.findByUsuario(
        req.session.user.user_id
      );
      res.render("pages/minhas-reservas", {
        title: "Minhas Reservas",
        reservas: reservas.map((r) => (r.toJSON ? r.toJSON() : r)),
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).render("error", {
        message: "Erro ao buscar suas reservas",
        error: error.message,
      });
    }
  }

  static async getReservasByUser(userId) {
    try {
      return await reservaRepository.findByUsuario(userId);
    } catch (error) {
      console.error("Erro ao buscar reservas do usuário:", error);
      throw error;
    }
  }

  static async createReserva(userId, roomId, startTime, endTime, reason) {
    try {
      console.log("Criando reserva:", {
        userId,
        roomId,
        startTime,
        endTime,
        reason,
      });

      // Verificar se a sala está disponível
      const hasConflict = await reservaRepository.checkTimeConflict(
        roomId,
        startTime,
        endTime
      );
      console.log("Conflito de horário:", hasConflict);

      if (hasConflict) {
        throw new Error("Sala não está disponível no horário selecionado");
      }

      // Criar a reserva usando o método create do repositório
      const reserva = await reservaRepository.create({
        room_id: roomId,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        reason: reason || null,
      });

      if (!reserva) {
        throw new Error("Erro ao criar reserva no banco de dados");
      }

      console.log("Reserva criada:", reserva);
      return reserva;
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      throw error;
    }
  }

  static async cancelReserva(bookingId) {
    try {
      return await reservaRepository.cancelReserva(bookingId);
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      throw error;
    }
  }

  static async checkRoomAvailability(startTime, endTime, roomId = null) {
    try {
      console.log("Verificando disponibilidade:", {
        startTime,
        endTime,
        roomId,
      });
      const rooms = await reservaRepository.findAll();
      console.log("Salas encontradas:", rooms);

      const availability = {};
      for (const room of rooms) {
        const hasConflict = await reservaRepository.checkTimeConflict(
          room.room_id,
          startTime,
          endTime
        );
        availability[room.room_id] = !hasConflict;
      }

      console.log("Disponibilidade:", availability);

      if (roomId) {
        return availability[roomId] || false;
      }

      return availability;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      throw error;
    }
  }
}

module.exports = ReservaController;
