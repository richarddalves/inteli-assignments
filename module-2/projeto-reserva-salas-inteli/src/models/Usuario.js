// Modelo que representa a tabela de usuários no banco de dados
class Usuario {
  // Roles válidos para um usuário
  static ROLES = {
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student",
  };

  // Construtor da classe Usuario
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.registration_number = data.registration_number;
    this.role = data.role || Usuario.ROLES.STUDENT;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Método estático para criar uma instância de Usuario a partir de uma linha do banco
  static fromDatabase(row) {
    if (!row) return null;
    return new Usuario({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      registration_number: row.registration_number,
      role: row.role,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  }

  // Método para converter o objeto para JSON, excluindo a senha
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      registration_number: this.registration_number,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Valida os dados do usuário
  validate() {
    const errors = [];

    if (!this.name) {
      errors.push("Nome é obrigatório");
    }

    if (!this.email) {
      errors.push("Email é obrigatório");
    } else if (!this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Email inválido");
    }

    if (!this.password) {
      errors.push("Senha é obrigatória");
    } else if (this.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }

    if (
      this.registration_number !== undefined &&
      this.registration_number !== null &&
      this.registration_number.trim() === ""
    ) {
      errors.push("Número de matrícula não pode ser vazio se fornecido");
    }

    if (this.role && !Object.values(Usuario.ROLES).includes(this.role)) {
      errors.push("Role inválido");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  // Verifica se o usuário está ativo
  isActive() {
    return this.is_active;
  }

  // Verifica se o usuário é admin
  isAdmin() {
    return this.role === Usuario.ROLES.ADMIN;
  }

  // Verifica se o usuário é professor
  isProfessor() {
    return this.role === Usuario.ROLES.TEACHER;
  }

  // Verifica se o usuário é estudante
  isStudent() {
    return this.role === Usuario.ROLES.STUDENT;
  }

  // Verifica se o usuário tem permissão para gerenciar reservas
  canManageBookings() {
    return this.isAdmin() || this.isProfessor();
  }

  // Verifica se o usuário tem permissão para gerenciar salas
  canManageRooms() {
    return this.isAdmin();
  }

  // Verifica se o usuário tem permissão para gerenciar usuários
  canManageUsers() {
    return this.isAdmin();
  }
}

module.exports = Usuario;
