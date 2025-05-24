// Modelo que representa a tabela de salas no banco de dados
class Sala {
  // Construtor da classe Sala
  constructor(
    room_id,
    name,
    capacity,
    room_type_id,
    location,
    description,
    is_active,
    created_at,
    updated_at
  ) {
    this.room_id = room_id;
    this.name = name;
    this.capacity = capacity;
    this.room_type_id = room_type_id;
    this.location = location;
    this.description = description;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método estático para criar uma instância de Sala a partir de uma linha do banco
  static fromDB(row) {
    if (!row) return null;
    return new Sala(
      row.room_id,
      row.name,
      row.capacity,
      row.room_type_id,
      row.location,
      row.description,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }

  // Método para converter o objeto para JSON
  toJSON() {
    return {
      room_id: this.room_id,
      name: this.name,
      capacity: this.capacity,
      room_type_id: this.room_type_id,
      location: this.location,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Valida os dados da sala
  static validate(sala) {
    if (!sala.name || sala.name.trim() === "") {
      throw new Error("Nome da sala é obrigatório");
    }

    if (!sala.capacity || sala.capacity <= 0) {
      throw new Error("Capacidade deve ser maior que zero");
    }

    if (!sala.room_type_id) {
      throw new Error("Tipo de sala é obrigatório");
    }

    return true;
  }

  // Verifica se a sala está ativa
  isActive() {
    return this.is_active;
  }

  // Verifica se a sala tem capacidade suficiente
  hasCapacity(requiredCapacity) {
    return this.capacity >= requiredCapacity;
  }

  // Verifica se a sala está disponível em um horário específico
  async isAvailable(start_time, end_time, exclude_booking_id = null) {
    const ReservaRepository = require("../repositories/ReservaRepository");
    return !(await ReservaRepository.checkConflitoHorario(
      this.room_id,
      start_time,
      end_time,
      exclude_booking_id
    ));
  }
}

module.exports = Sala;
