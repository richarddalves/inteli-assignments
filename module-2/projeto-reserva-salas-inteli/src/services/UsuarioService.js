const UsuarioRepository = require("../repositories/UsuarioRepository");
const bcrypt = require("bcrypt");

class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async criarUsuario(dados) {
    // Validações de negócio
    const emailExistente = await this.usuarioRepository.findByEmail(
      dados.email
    );
    if (emailExistente) {
      throw new Error("Email já cadastrado");
    }

    const tiposValidos = ["estudante", "professor", "admin"];
    if (!tiposValidos.includes(dados.tipo_usuario)) {
      throw new Error("Tipo de usuário inválido");
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dados.senha, salt);

    // Criar usuário com senha hasheada
    const usuarioData = {
      ...dados,
      senha: senhaHash,
    };

    return await this.usuarioRepository.create(usuarioData);
  }

  async atualizarUsuario(id, dados) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Se estiver atualizando o email, verificar se já existe
    if (dados.email && dados.email !== usuario.email) {
      const emailExistente = await this.usuarioRepository.findByEmail(
        dados.email
      );
      if (emailExistente) {
        throw new Error("Email já cadastrado");
      }
    }

    // Se estiver atualizando o tipo de usuário, validar
    if (dados.tipo_usuario) {
      const tiposValidos = ["estudante", "professor", "admin"];
      if (!tiposValidos.includes(dados.tipo_usuario)) {
        throw new Error("Tipo de usuário inválido");
      }
    }

    // Se estiver atualizando a senha, fazer hash
    if (dados.senha) {
      const salt = await bcrypt.genSalt(10);
      dados.senha = await bcrypt.hash(dados.senha, salt);
    }

    return await this.usuarioRepository.update(id, dados);
  }

  async validarCredenciais(email, senha) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error("Senha inválida");
    }

    return usuario;
  }
}

module.exports = UsuarioService;
