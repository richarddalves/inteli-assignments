// Modelo que representa a tabela de tipos de sala no banco de dados
class TipoSala {
  // Construtor da classe TipoSala
  constructor(room_type_id, type_name, description, created_at, updated_at) {
    this.room_type_id = room_type_id;
    this.type_name = type_name;
    this.description = description;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Método estático para criar uma instância de TipoSala a partir de uma linha do banco
  static fromDB(row) {
    if (!row) return null;
    return new TipoSala(
      row.room_type_id,
      row.type_name,
      row.description,
      row.created_at,
      row.updated_at
    );
  }

  // Método para converter o objeto para JSON
  toJSON() {
    return {
      room_type_id: this.room_type_id,
      type_name: this.type_name,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Valida os dados do tipo de sala
  static validate(tipoSala) {
    if (!tipoSala.type_name || tipoSala.type_name.trim() === "") {
      throw new Error("Nome do tipo de sala é obrigatório");
    }

    return true;
  }

  // Verifica se o tipo de sala está ativo
  isActive() {
    return this.is_active;
  }
}

module.exports = TipoSala;
