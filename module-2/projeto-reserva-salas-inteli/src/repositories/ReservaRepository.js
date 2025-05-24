// Repositório responsável pelas operações de banco de dados relacionadas às reservas
const db = require("../config/db");
const Reserva = require("../models/Reserva");

class ReservaRepository {
  // Busca todas as reservas no banco de dados, incluindo informações do usuário e da sala
  async findAll() {
    const query = `
            SELECT b.*, u.name as user_name, r.name as room_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            ORDER BY b.start_time DESC
        `;
    const result = await db.query(query);
    return result.rows.map((row) => ({
      ...Reserva.fromDB(row),
      user_name: row.user_name,
      room_name: row.room_name,
    }));
  }

  // Busca uma reserva pelo ID, incluindo informações do usuário e da sala
  async findById(id) {
    const query = `
            SELECT b.*, u.name as user_name, r.name as room_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.booking_id = $1
        `;
    const result = await db.query(query, [id]);
    if (!result.rows[0]) return null;
    return {
      ...Reserva.fromDB(result.rows[0]),
      user_name: result.rows[0].user_name,
      room_name: result.rows[0].room_name,
    };
  }

  // Busca todas as reservas de um usuário específico
  async findByUsuario(usuario_id) {
    const query = `
            SELECT b.*, u.name as user_name, r.name as room_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.user_id = $1
            ORDER BY b.start_time DESC
        `;
    const result = await db.query(query, [usuario_id]);
    return result.rows.map((row) => ({
      ...Reserva.fromDB(row),
      user_name: row.user_name,
      room_name: row.room_name,
    }));
  }

  // Busca todas as reservas de uma sala específica
  async findBySala(sala_id) {
    const query = `
            SELECT b.*, u.name as user_name, r.name as room_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.room_id = $1
            ORDER BY b.start_time DESC
        `;
    const result = await db.query(query, [sala_id]);
    return result.rows.map((row) => ({
      ...Reserva.fromDB(row),
      user_name: row.user_name,
      room_name: row.room_name,
    }));
  }

  // Cria uma nova reserva no banco de dados
  async create(reserva) {
    const query = `
            INSERT INTO bookings (room_id, user_id, start_time, end_time, status, reason)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
    const values = [
      reserva.room_id,
      reserva.user_id,
      reserva.start_time,
      reserva.end_time,
      reserva.status,
      reserva.reason,
    ];
    const result = await db.query(query, values);
    return Reserva.fromDB(result.rows[0]);
  }

  // Atualiza uma reserva existente no banco de dados
  async update(id, reserva) {
    const query = `
            UPDATE bookings 
            SET room_id = $1, 
                user_id = $2, 
                start_time = $3, 
                end_time = $4, 
                status = $5, 
                reason = $6,
                updated_at = NOW()
            WHERE booking_id = $7
            RETURNING *
        `;
    const values = [
      reserva.room_id,
      reserva.user_id,
      reserva.start_time,
      reserva.end_time,
      reserva.status,
      reserva.reason,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0] ? Reserva.fromDB(result.rows[0]) : null;
  }

  // Atualiza apenas o status de uma reserva
  async updateStatus(id, status) {
    const query = `
            UPDATE bookings 
            SET status = $1, updated_at = NOW()
            WHERE booking_id = $2
            RETURNING *
        `;
    const result = await db.query(query, [status, id]);
    return result.rows[0] ? Reserva.fromDB(result.rows[0]) : null;
  }

  // Remove uma reserva do banco de dados
  async delete(id) {
    const query = "DELETE FROM bookings WHERE booking_id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0] ? Reserva.fromDB(result.rows[0]) : null;
  }
}

module.exports = new ReservaRepository();
 