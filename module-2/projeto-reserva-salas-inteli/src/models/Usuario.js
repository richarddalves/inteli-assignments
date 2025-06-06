// Modelo que representa a tabela de usuários no banco de dados
class Usuario {
  // Roles válidos para um usuário
  static ROLES = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin",
  };

  // Construtor da classe Usuario
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.registration_number = data.registration_number;
    this.role = data.role || Usuario.ROLES.STUDENT;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Valida se o role é válido
  static isValidRole(role) {
    return Object.values(Usuario.ROLES).includes(role);
  }

  // Valida os dados do usuário
  static validate(data) {
    const errors = [];

    if (!data.name || data.name.length < 1 || data.name.length > 100) {
      errors.push("Nome deve ter entre 1 e 100 caracteres");
    }

    if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Email inválido");
    }

    if (!data.password || data.password.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }

    if (data.registration_number && data.registration_number.length > 20) {
      errors.push("Matrícula deve ter no máximo 20 caracteres");
    }

    if (data.role && !Usuario.isValidRole(data.role)) {
      errors.push("Papel inválido");
    }

    return errors;
  }
}

module.exports = Usuario;
