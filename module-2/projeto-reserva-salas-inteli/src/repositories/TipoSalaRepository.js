// Repositório responsável pelas operações de banco de dados relacionadas aos tipos de sala
const db = require("../config/db");
const TipoSala = require("../models/TipoSala");

class TipoSalaRepository {
  // Busca todos os tipos de sala no banco de dados
  async findAll() {
    const query = `
      SELECT * FROM room_types
      ORDER BY type_name ASC
    `;
    const result = await db.query(query);
    return result.rows.map((row) => TipoSala.fromDB(row));
  }

  // Busca um tipo de sala pelo ID
  async findById(id) {
    const query = `
      SELECT * FROM room_types
      WHERE room_type_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] ? TipoSala.fromDB(result.rows[0]) : null;
  }

  // Busca um tipo de sala pelo nome
  async findByName(name) {
    const query = `
      SELECT * FROM room_types
      WHERE type_name = $1
    `;
    const result = await db.query(query, [name]);
    return result.rows[0] ? TipoSala.fromDB(result.rows[0]) : null;
  }

  // Cria um novo tipo de sala
  async create(tipoSala) {
    // Validar dados
    TipoSala.validate(tipoSala);

    // Verificar se já existe um tipo com o mesmo nome
    const existing = await this.findByName(tipoSala.type_name);
    if (existing) {
      throw new Error("Já existe um tipo de sala com este nome");
    }

    const query = `
      INSERT INTO room_types (
        type_name,
        description,
        created_at,
        updated_at
      )
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `;
    const values = [tipoSala.type_name, tipoSala.description];
    const result = await db.query(query, values);
    return TipoSala.fromDB(result.rows[0]);
  }

  // Atualiza um tipo de sala existente
  async update(id, tipoSala) {
    // Validar dados
    TipoSala.validate(tipoSala);

    // Verificar se já existe outro tipo com o mesmo nome
    const existing = await this.findByName(tipoSala.type_name);
    if (existing && existing.room_type_id !== id) {
      throw new Error("Já existe um tipo de sala com este nome");
    }

    const query = `
      UPDATE room_types 
      SET 
        type_name = COALESCE($1, type_name),
        description = COALESCE($2, description),
        updated_at = NOW()
      WHERE room_type_id = $3
      RETURNING *
    `;
    const values = [tipoSala.type_name, tipoSala.description, id];
    const result = await db.query(query, values);
    return result.rows[0] ? TipoSala.fromDB(result.rows[0]) : null;
  }

  // Remove um tipo de sala
  async delete(id) {
    // Verificar se existem salas usando este tipo
    const query = `
      SELECT COUNT(*) FROM rooms
      WHERE room_type_id = $1
    `;
    const result = await db.query(query, [id]);
    if (parseInt(result.rows[0].count) > 0) {
      throw new Error("Não é possível excluir um tipo de sala que está em uso");
    }

    const deleteQuery = `
      DELETE FROM room_types 
      WHERE room_type_id = $1 
      RETURNING *
    `;
    const deleteResult = await db.query(deleteQuery, [id]);
    return deleteResult.rows[0] ? TipoSala.fromDB(deleteResult.rows[0]) : null;
  }

  // Atualiza o status de um tipo de sala
  async updateStatus(id, is_active) {
    const query = `
      UPDATE room_types 
      SET 
        is_active = $1,
        updated_at = NOW()
      WHERE room_type_id = $2
      RETURNING *
    `;
    const result = await db.query(query, [is_active, id]);
    return result.rows[0] ? TipoSala.fromDB(result.rows[0]) : null;
  }
}

module.exports = new TipoSalaRepository();
