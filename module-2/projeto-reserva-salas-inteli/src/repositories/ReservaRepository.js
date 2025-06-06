// Repositório responsável pelas operações de banco de dados relacionadas às reservas
const db = require("../config/db");
const Reserva = require("../models/Reserva");

class ReservaRepository {
  // Busca todas as reservas no banco de dados, incluindo informações do usuário e da sala
  async findAll() {
    try {
      const query = `
        WITH current_bookings AS (
          SELECT room_id, COUNT(*) as booking_count
          FROM bookings
          WHERE status IN ('reserved', 'approved')
          AND start_time <= CURRENT_TIMESTAMP
          AND end_time > CURRENT_TIMESTAMP
          GROUP BY room_id
        )
        SELECT 
          r.room_id,
          r.name,
          r.location,
          rt.type_name as room_type,
          COALESCE(cb.booking_count, 0) > 0 as is_reserved
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        LEFT JOIN current_bookings cb ON r.room_id = cb.room_id
        WHERE r.is_active = true
        ORDER BY r.location, r.name
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      throw error;
    }
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
    try {
      const query = `
            SELECT b.*, u.name as user_name, r.name as room_name 
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.user_id = $1
            ORDER BY b.start_time DESC
        `;
      const result = await db.query(query, [usuario_id]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar reservas do usuário:", error);
      throw error;
    }
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
    try {
      const query = `
            INSERT INTO bookings (room_id, user_id, start_time, end_time, status, reason)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
      const values = [
        reserva.room_id,
        reserva.user_id,
        new Date(reserva.start_time).toISOString(),
        new Date(reserva.end_time).toISOString(),
        "reserved", // Status fixo como 'reserved'
        reserva.reason || null,
      ];

      const result = await db.query(query, values);

      if (!result.rows[0]) {
        throw new Error("Falha ao criar reserva no banco de dados");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao executar query:", error);
      throw error;
    }
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

  static async getReservasByUser(userId) {
    try {
      const query = `
        SELECT b.*, r.name as room_name, r.floor, rt.name as room_type
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        JOIN room_types rt ON r.room_type_id = rt.id
        WHERE b.user_id = $1
        ORDER BY b.start_time DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar reservas do usuário:", error);
      throw error;
    }
  }

  static async createReserva(userId, roomId, startTime, endTime, reason) {
    try {
      const query = `
        INSERT INTO bookings (user_id, room_id, start_time, end_time, reason, status)
        VALUES ($1, $2, $3, $4, $5, 'reserved')
        RETURNING *
      `;
      const result = await db.query(query, [
        userId,
        roomId,
        startTime,
        endTime,
        reason,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      throw error;
    }
  }

  static async cancelReserva(bookingId) {
    try {
      const query = `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [bookingId]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      throw error;
    }
  }

  static async getAllRooms() {
    try {
      const query = `
        WITH current_bookings AS (
          SELECT room_id, COUNT(*) as booking_count
          FROM bookings
          WHERE status IN ('reserved', 'approved')
          AND start_time <= NOW()
          AND end_time > NOW()
          GROUP BY room_id
        )
        SELECT 
          r.room_id,
          r.name,
          r.location,
          rt.type_name as room_type,
          COALESCE(cb.booking_count, 0) > 0 as is_reserved
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
        LEFT JOIN current_bookings cb ON r.room_id = cb.room_id
        WHERE r.is_active = true
        ORDER BY r.location, r.name
      `;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      throw error;
    }
  }

  async checkTimeConflict(roomId, startTime, endTime) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM bookings
        WHERE room_id = $1
        AND status IN ('reserved', 'approved')
        AND (
          (start_time <= $2 AND end_time > $2)
          OR (start_time < $3 AND end_time >= $3)
          OR (start_time >= $2 AND end_time <= $3)
        )
      `;
      const result = await db.query(query, [
        roomId,
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString(),
      ]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar conflito de horário:", error);
      throw error;
    }
  }

  async getStats() {
    try {
      // Busca reservas de hoje
      const todayQuery = `
        SELECT COUNT(*) as count
        FROM bookings
        WHERE DATE(start_time) = CURRENT_DATE
        AND status IN ('reserved', 'approved')
      `;

      // Busca reservas da semana
      const weekQuery = `
        SELECT COUNT(*) as count
        FROM bookings
        WHERE start_time >= DATE_TRUNC('week', CURRENT_DATE)
        AND start_time < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
        AND status IN ('reserved', 'approved')
      `;

      // Busca usuários ativos (que fizeram reservas nos últimos 30 dias)
      const activeUsersQuery = `
        SELECT COUNT(DISTINCT user_id) as count
        FROM bookings
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `;

      const [todayResult, weekResult, activeUsersResult] = await Promise.all([
        db.query(todayQuery),
        db.query(weekQuery),
        db.query(activeUsersQuery),
      ]);

      return {
        today: parseInt(todayResult.rows[0].count),
        week: parseInt(weekResult.rows[0].count),
        activeUsers: parseInt(activeUsersResult.rows[0].count),
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }
}

// Exporta uma instância da classe
module.exports = new ReservaRepository();
