// Controlador responsável pelas operações relacionadas às salas
const salaRepository = require("../repositories/SalaRepository");
const tipoSalaRepository = require("../repositories/TipoSalaRepository");

class SalaController {
  // Lista todas as salas cadastradas
  async listarSalas(req, res) {
    try {
      const salas = await salaRepository.findAll();
      res.json({ salas: salas.map((s) => (s.toJSON ? s.toJSON() : s)) });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao listar salas", details: error.message });
    }
  }

  // Busca uma sala específica pelo ID
  async buscarSala(req, res) {
    try {
      const sala = await salaRepository.findById(req.params.room_id);
      if (!sala) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }
      const obj = sala.toJSON ? sala.toJSON() : sala;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar sala", details: error.message });
    }
  }

  // Busca salas por tipo específico
  async buscarPorTipo(req, res) {
    try {
      const { room_type_id } = req.params;
      const salas = await salaRepository.findByTipo(room_type_id);
      res.json({ salas: salas.map((s) => (s.toJSON ? s.toJSON() : s)) });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar salas por tipo",
        details: error.message,
      });
    }
  }

  // Cria uma nova sala no sistema
  async criarSala(req, res) {
    try {
      const { name, capacity, room_type_id, location, description, is_active } =
        req.body;
      if (!name || !capacity || !room_type_id) {
        return res
          .status(400)
          .json({ error: "Nome, capacidade e tipo de sala são obrigatórios" });
      }
      if (capacity <= 0) {
        return res
          .status(400)
          .json({ error: "A capacidade deve ser maior que zero" });
      }

      // Verifica se o tipo de sala existe
      const tipoSala = await tipoSalaRepository.findById(room_type_id);
      if (!tipoSala) {
        return res.status(400).json({ error: "Tipo de sala não encontrado" });
      }

      // Verifica se já existe sala com o mesmo nome
      const salas = await salaRepository.findAll();
      if (salas.some((s) => (s.toJSON ? s.toJSON().name : s.name) === name)) {
        return res
          .status(400)
          .json({ error: "Já existe uma sala com este nome" });
      }

      const sala = await salaRepository.create({
        name,
        capacity,
        room_type_id,
        location,
        description,
        is_active: is_active !== undefined ? is_active : true,
      });
      const obj = sala.toJSON ? sala.toJSON() : sala;
      res.status(201).json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao criar sala", details: error.message });
    }
  }

  // Atualiza os dados de uma sala existente
  async atualizarSala(req, res) {
    try {
      const { name, capacity, room_type_id, location, description, is_active } =
        req.body;
      const room_id = req.params.room_id;
      const salaExistente = await salaRepository.findById(room_id);
      if (!salaExistente) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }
      if (capacity && capacity <= 0) {
        return res
          .status(400)
          .json({ error: "A capacidade deve ser maior que zero" });
      }
      const dadosAtualizacao = {
        name: name || salaExistente.name,
        capacity: capacity || salaExistente.capacity,
        room_type_id: room_type_id || salaExistente.room_type_id,
        location: location || salaExistente.location,
        description: description || salaExistente.description,
        is_active:
          is_active !== undefined ? is_active : salaExistente.is_active,
      };
      const salaAtualizada = await salaRepository.update(
        room_id,
        dadosAtualizacao
      );
      const obj = salaAtualizada.toJSON
        ? salaAtualizada.toJSON()
        : salaAtualizada;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar sala", details: error.message });
    }
  }

  // Remove uma sala do sistema
  async deletarSala(req, res) {
    try {
      const room_id = req.params.room_id;
      const sala = await salaRepository.findById(room_id);
      if (!sala) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }
      await salaRepository.delete(room_id);
      res.status(200).json({ message: "Sala excluída com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao excluir sala", details: error.message });
    }
  }

  // Verifica a disponibilidade de uma sala em um determinado período
  async verificarDisponibilidade(req, res) {
    try {
      const { room_id, start_time, end_time } = req.body;
      if (!room_id || !start_time || !end_time) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios" });
      }
      const sala = await salaRepository.findById(room_id);
      if (!sala) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }
      const disponivel = await salaRepository.checkDisponibilidade(
        room_id,
        start_time,
        end_time
      );
      res.json({ disponivel });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao verificar disponibilidade",
        details: error.message,
      });
    }
  }
}

module.exports = new SalaController();
