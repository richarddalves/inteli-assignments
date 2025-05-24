// Repositório responsável pelas operações de banco de dados relacionadas às salas
const db = require("../config/db");
const Sala = require("../models/Sala");

class SalaRepository {
  // Busca todas as salas no banco de dados
  async findAll() {
    const query = `
      SELECT r.*, rt.type_name 
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      ORDER BY r.name
    `;
    const result = await db.query(query);
    return result.rows.map((row) => Sala.fromDB(row));
  }

  // Busca uma sala pelo ID
  async findById(id) {
    const query = `
      SELECT r.*, rt.type_name 
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] ? Sala.fromDB(result.rows[0]) : null;
  }

  // Busca salas por tipo
  async findByTipo(tipo_sala) {
    const query = `
      SELECT r.*, rt.type_name 
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.room_type_id
      WHERE r.room_type_id = $1
      ORDER BY r.name
    `;
    const result = await db.query(query, [tipo_sala]);
    return result.rows.map((row) => Sala.fromDB(row));
  }

  // Cria uma nova sala no banco de dados
  async create(sala) {
    const query = `
      INSERT INTO rooms (room_type_id, name, capacity, location, description, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      sala.room_type_id,
      sala.name,
      sala.capacity,
      sala.location,
      sala.description,
      sala.is_active,
    ];
    const result = await db.query(query, values);
    return Sala.fromDB(result.rows[0]);
  }

  // Atualiza uma sala existente no banco de dados
  async update(id, sala) {
    const query = `
      UPDATE rooms 
      SET room_type_id = $1,
          name = $2,
          capacity = $3,
          location = $4,
          description = $5,
          is_active = $6,
          updated_at = NOW()
      WHERE room_id = $7
      RETURNING *
    `;
    const values = [
      sala.room_type_id,
      sala.name,
      sala.capacity,
      sala.location,
      sala.description,
      sala.is_active,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0] ? Sala.fromDB(result.rows[0]) : null;
  }

  // Remove uma sala do banco de dados
  async delete(id) {
    const query = "DELETE FROM rooms WHERE room_id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0] ? Sala.fromDB(result.rows[0]) : null;
  }

  // Verifica se uma sala está disponível em um determinado período
  async checkDisponibilidade(sala_id, data_inicio, data_fim) {
    const query = `
      SELECT COUNT(*) AS count
      FROM bookings b
      WHERE b.room_id = $1
      AND b.status = 'reserved'
      AND (
        (b.start_time < $3 AND b.end_time > $2)
      )
    `;
    const result = await db.query(query, [sala_id, data_inicio, data_fim]);
    return parseInt(result.rows[0].count) === 0;
  }
}

module.exports = new SalaRepository();
 