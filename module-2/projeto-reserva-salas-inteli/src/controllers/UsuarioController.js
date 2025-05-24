const usuarioRepository = require("../repositories/UsuarioRepository");
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

class UsuarioController {
  async listarUsuarios(req, res) {
    try {
      const usuarios = await usuarioRepository.findAll();
      res.json({
        usuarios: usuarios.map((u) => {
          const obj = u.toJSON ? u.toJSON() : u;
          if (obj.password) delete obj.password;
          return obj;
        }),
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao listar usuários", details: error.message });
    }
  }

  async buscarUsuario(req, res) {
    try {
      const usuario = await usuarioRepository.findById(req.params.user_id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const obj = usuario.toJSON ? usuario.toJSON() : usuario;
      if (obj.password) delete obj.password;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao buscar usuário", details: error.message });
    }
  }

  async criarUsuario(req, res) {
    try {
      const { name, email, password, registration_number, role } = req.body;

      // Validação básica dos campos obrigatórios
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Nome, email e senha são obrigatórios" });
      }

      // Validação do email
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      // Validação da senha
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Senha deve ter pelo menos 6 caracteres" });
      }

      // Validação do role
      if (role && !Object.values(Usuario.ROLES).includes(role)) {
        return res.status(400).json({ error: "Role inválido" });
      }

      const usuarioExistente = await usuarioRepository.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const senhaHash = await bcrypt.hash(password, 10);

      const usuario = await usuarioRepository.create({
        name,
        email,
        password: senhaHash,
        registration_number: registration_number || null,
        role: role || Usuario.ROLES.STUDENT,
      });

      const userObj = usuario.toJSON ? usuario.toJSON() : usuario;
      if (userObj.password) delete userObj.password;
      res.status(201).json(userObj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao criar usuário", details: error.message });
    }
  }

  async atualizarUsuario(req, res) {
    try {
      const { name, email, password, registration_number, role } = req.body;
      const user_id = req.params.user_id;

      // Validação do ID
      if (!user_id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const usuarioExistente = await usuarioRepository.findById(user_id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Validação do email se fornecido
      if (email) {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return res.status(400).json({ error: "Email inválido" });
        }
        if (email !== usuarioExistente.email) {
          const emailExistente = await usuarioRepository.findByEmail(email);
          if (emailExistente) {
            return res.status(400).json({ error: "Email já cadastrado" });
          }
        }
      }

      // Validação do role se fornecido
      if (role && !Object.values(Usuario.ROLES).includes(role)) {
        return res.status(400).json({ error: "Role inválido" });
      }

      const dadosAtualizacao = {
        name: name || usuarioExistente.name,
        email: email || usuarioExistente.email,
        password: password
          ? await bcrypt.hash(password, 10)
          : usuarioExistente.password,
        registration_number:
          registration_number || usuarioExistente.registration_number,
        role: role || usuarioExistente.role,
      };

      const usuarioAtualizado = await usuarioRepository.update(
        user_id,
        dadosAtualizacao
      );

      const obj = usuarioAtualizado.toJSON
        ? usuarioAtualizado.toJSON()
        : usuarioAtualizado;
      if (obj.password) delete obj.password;
      res.json(obj);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar usuário", details: error.message });
    }
  }

  async deletarUsuario(req, res) {
    try {
      const user_id = req.params.user_id;
      if (!user_id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const usuario = await usuarioRepository.findById(user_id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await usuarioRepository.delete(user_id);
      res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao excluir usuário", details: error.message });
    }
  }
}

module.exports = new UsuarioController();
