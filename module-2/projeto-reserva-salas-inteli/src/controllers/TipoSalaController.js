// Controlador responsável pelas operações relacionadas aos tipos de sala
const tipoSalaRepository = require("../repositories/TipoSalaRepository");

class TipoSalaController {
  // Lista todos os tipos de sala cadastrados
  async listarTiposSala(req, res) {
    try {
      const tipos = await tipoSalaRepository.findAll();
      res.json({ tipos: tipos.map((t) => (t.toJSON ? t.toJSON() : t)) });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao listar tipos de sala",
        details: error.message,
      });
    }
  }

  // Busca um tipo de sala específico pelo ID
  async buscarTipoSala(req, res) {
    try {
      const tipo = await tipoSalaRepository.findById(req.params.room_type_id);
      if (!tipo) {
        return res.status(404).json({ error: "Tipo de sala não encontrado" });
      }
      const obj = tipo.toJSON ? tipo.toJSON() : tipo;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar tipo de sala", details: error.message });
    }
  }

  // Cria um novo tipo de sala
  async criarTipoSala(req, res) {
    try {
      const { type_name, description } = req.body;
      if (!type_name) {
        return res
          .status(400)
          .json({ error: "Nome do tipo de sala é obrigatório" });
      }

      const tipo = await tipoSalaRepository.create({
        type_name,
        description,
      });

      const obj = tipo.toJSON ? tipo.toJSON() : tipo;
      res.status(201).json(obj);
    } catch (error) {
      if (error.message.includes("Já existe")) {
        return res.status(400).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Erro ao criar tipo de sala", details: error.message });
    }
  }

  // Atualiza um tipo de sala existente
  async atualizarTipoSala(req, res) {
    try {
      const { type_name, description } = req.body;
      const room_type_id = req.params.room_type_id;

      const tipoExistente = await tipoSalaRepository.findById(room_type_id);
      if (!tipoExistente) {
        return res.status(404).json({ error: "Tipo de sala não encontrado" });
      }

      const tipo = await tipoSalaRepository.update(room_type_id, {
        type_name,
        description,
      });

      const obj = tipo.toJSON ? tipo.toJSON() : tipo;
      res.json(obj);
    } catch (error) {
      if (error.message.includes("Já existe")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({
        error: "Erro ao atualizar tipo de sala",
        details: error.message,
      });
    }
  }

  // Remove um tipo de sala
  async deletarTipoSala(req, res) {
    try {
      const room_type_id = req.params.room_type_id;
      const tipo = await tipoSalaRepository.findById(room_type_id);
      if (!tipo) {
        return res.status(404).json({ error: "Tipo de sala não encontrado" });
      }

      await tipoSalaRepository.delete(room_type_id);
      res.status(200).json({ message: "Tipo de sala excluído com sucesso" });
    } catch (error) {
      if (error.message.includes("em uso")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({
        error: "Erro ao excluir tipo de sala",
        details: error.message,
      });
    }
  }

  // Atualiza o status de um tipo de sala
  async atualizarStatus(req, res) {
    try {
      const { is_active } = req.body;
      const room_type_id = req.params.room_type_id;

      if (typeof is_active !== "boolean") {
        return res.status(400).json({ error: "Status inválido" });
      }

      const tipoExistente = await tipoSalaRepository.findById(room_type_id);
      if (!tipoExistente) {
        return res.status(404).json({ error: "Tipo de sala não encontrado" });
      }

      const tipo = await tipoSalaRepository.updateStatus(
        room_type_id,
        is_active
      );
      const obj = tipo.toJSON ? tipo.toJSON() : tipo;
      res.json(obj);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao atualizar status do tipo de sala",
        details: error.message,
      });
    }
  }
}

module.exports = new TipoSalaController();
