// Modelo que representa a tabela de reservas no banco de dados
class Reserva {
  // Status válidos para uma reserva
  static STATUS = {
    RESERVED: "reserved",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    RELEASED: "released",
  };

  // Construtor da classe Reserva
  constructor(
    booking_id,
    room_id,
    user_id,
    start_time,
    end_time,
    status,
    reason,
    created_at,
    updated_at
  ) {
    this.booking_id = booking_id;
    this.room_id = room_id;
    this.user_id = user_id;
    this.start_time = start_time;
    this.end_time = end_time;
    this.status = status;
    this.reason = reason;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método estático para criar uma instância de Reserva a partir de uma linha do banco
  static fromDB(row) {
    if (!row) return null;
    return new Reserva(
      row.booking_id,
      row.room_id,
      row.user_id,
      row.start_time,
      row.end_time,
      row.status,
      row.reason,
      row.created_at,
      row.updated_at
    );
  }

  // Método para converter o objeto para JSON
  toJSON() {
    return {
      booking_id: this.booking_id,
      room_id: this.room_id,
      user_id: this.user_id,
      start_time: this.start_time,
      end_time: this.end_time,
      status: this.status,
      reason: this.reason,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Valida se o status é válido
  static isValidStatus(status) {
    return Object.values(Reserva.STATUS).includes(status);
  }

  // Valida se as datas são válidas
  static validateDates(start_time, end_time) {
    const start = new Date(start_time);
    const end = new Date(end_time);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Datas inválidas");
    }

    if (start >= end) {
      throw new Error("A data de início deve ser anterior à data de fim");
    }

    if (start < now) {
      throw new Error("A data de início deve ser futura");
    }

    return true;
  }

  // Verifica se a reserva está ativa (não cancelada ou rejeitada)
  isActive() {
    return (
      this.status !== Reserva.STATUS.CANCELLED &&
      this.status !== Reserva.STATUS.REJECTED
    );
  }

  // Verifica se a reserva está em andamento
  isInProgress() {
    const now = new Date();
    const start = new Date(this.start_time);
    const end = new Date(this.end_time);
    return this.isActive() && now >= start && now <= end;
  }

  // Verifica se a reserva está pendente
  isPending() {
    return this.status === Reserva.STATUS.RESERVED;
  }

  // Verifica se a reserva está aprovada
  isApproved() {
    return this.status === Reserva.STATUS.APPROVED;
  }

  // Verifica se a reserva está concluída
  isCompleted() {
    return this.status === Reserva.STATUS.COMPLETED;
  }

  // Verifica se a reserva está cancelada
  isCancelled() {
    return this.status === Reserva.STATUS.CANCELLED;
  }

  // Verifica se a reserva está rejeitada
  isRejected() {
    return this.status === Reserva.STATUS.REJECTED;
  }
}

module.exports = Reserva;
