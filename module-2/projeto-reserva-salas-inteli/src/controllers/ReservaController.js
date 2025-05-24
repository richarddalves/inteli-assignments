// Controlador responsável pelas operações relacionadas às reservas
const reservaRepository = require("../repositories/ReservaRepository");
const salaRepository = require("../repositories/SalaRepository");

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

      // Verificar se sala existe e está ativa
      const sala = await salaRepository.findById(room_id);
      if (!sala) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }
      if (!sala.is_active) {
        return res.status(400).json({ error: "Sala está inativa" });
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
      const disponivel = await salaRepository.checkDisponibilidade(
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
        const disponivel = await salaRepository.checkDisponibilidade(
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

      const reservaAtualizada = await reservaRepository.updateStatus(
        booking_id,
        status
      );

      const obj = reservaAtualizada.toJSON
        ? reservaAtualizada.toJSON()
        : reservaAtualizada;
      res.json(obj);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao atualizar status da reserva",
        details: error.message,
      });
    }
  }

  // Remove uma reserva do sistema
  async deletarReserva(req, res) {
    try {
      const booking_id = req.params.booking_id;
      const reserva = await reservaRepository.findById(booking_id);
      if (!reserva) {
        return res.status(404).json({ error: "Reserva não encontrada" });
      }
      await reservaRepository.delete(booking_id);
      res.status(200).json({ message: "Reserva excluída com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao excluir reserva", details: error.message });
    }
  }
}

module.exports = new ReservaController();
