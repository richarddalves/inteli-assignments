// Repositório responsável pelas operações de banco de dados relacionadas aos usuários
const db = require("../config/db");
const Usuario = require("../models/Usuario");

class UsuarioRepository {
  // Busca todos os usuários no banco de dados
  async findAll() {
    try {
      const result = await db.query(
        "SELECT * FROM users ORDER BY created_at DESC"
      );
      return result.rows.map((row) => Usuario.fromDatabase(row));
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  // Busca um usuário pelo ID
  async findById(id) {
    try {
      const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
        parseInt(id),
      ]);
      if (result.rows.length === 0) {
        return null;
      }
      return Usuario.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  // Busca um usuário pelo email
  async findByEmail(email) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (result.rows.length === 0) {
        return null;
      }
      return Usuario.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  // Cria um novo usuário no banco de dados
  async create(usuarioData) {
    try {
      const { name, email, password, registration_number, role } = usuarioData;

      const result = await db.query(
        `INSERT INTO users (name, email, password, registration_number, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, email, password, registration_number, role]
      );

      return Usuario.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Atualiza um usuário existente no banco de dados
  async update(id, usuarioData) {
    try {
      const { name, email, password, registration_number, role } = usuarioData;

      const result = await db.query(
        `UPDATE users 
         SET name = $1, 
             email = $2, 
             password = $3, 
             registration_number = $4, 
             role = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6
         RETURNING *`,
        [name, email, password, registration_number, role, id]
      );

      if (result.rows.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      return Usuario.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Remove um usuário do banco de dados
  async delete(id) {
    try {
      const result = await db.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("Usuário não encontrado");
      }
      return true;
    } catch (error) {
      throw new Error(`Erro ao excluir usuário: ${error.message}`);
    }
  }
}

module.exports = new UsuarioRepository();
 