// Modelo que representa a tabela de reservas no banco de dados
class Reserva {
  // Status válidos para uma reserva
  static STATUS = {
    RESERVED: "reserved",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
  };

  // Construtor da classe Reserva
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.room_id = data.room_id;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.status = data.status || Reserva.STATUS.RESERVED;
    this.reason = data.reason;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Valida se o status é válido
  static isValidStatus(status) {
    return Object.values(Reserva.STATUS).includes(status);
  }

  // Valida os dados da reserva
  static validate(data) {
    const errors = [];

    if (!data.user_id) {
      errors.push("ID do usuário é obrigatório");
    }

    if (!data.room_id) {
      errors.push("ID da sala é obrigatório");
    }

    if (!data.start_time) {
      errors.push("Horário de início é obrigatório");
    }

    if (!data.end_time) {
      errors.push("Horário de fim é obrigatório");
    }

    if (
      data.start_time &&
      data.end_time &&
      new Date(data.start_time) >= new Date(data.end_time)
    ) {
      errors.push("Horário de fim deve ser posterior ao horário de início");
    }

    if (data.status && !Reserva.isValidStatus(data.status)) {
      errors.push("Status inválido");
    }

    return errors;
  }
}

module.exports = Reserva;
