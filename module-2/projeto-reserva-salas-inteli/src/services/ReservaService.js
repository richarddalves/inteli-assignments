const ReservaRepository = require("../repositories/ReservaRepository");
const SalaRepository = require("../repositories/SalaRepository");
const UsuarioRepository = require("../repositories/UsuarioRepository");

class ReservaService {
  constructor() {
    this.reservaRepository = new ReservaRepository();
    this.salaRepository = new SalaRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  // Cria uma nova reserva após validar a existência da sala e do usuário,
  // e verificar a disponibilidade da sala no horário solicitado
  async criarReserva(dados) {
    // Validações de negócio
    const sala = await this.salaRepository.findById(dados.sala_id);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    const usuario = await this.usuarioRepository.findById(dados.usuario_id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar disponibilidade
    const disponivel = await this.salaRepository.checkDisponibilidade(
      dados.sala_id,
      dados.data_inicio,
      dados.data_fim
    );

    if (!disponivel) {
      throw new Error("Sala não está disponível no horário solicitado");
    }

    // Criar a reserva
    return await this.reservaRepository.create(dados);
  }

  // Atualiza o status de uma reserva existente
  // Valida se a reserva existe e se o novo status é válido
  async atualizarStatus(id, status) {
    const reserva = await this.reservaRepository.findById(id);
    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    const statusValidos = ["pendente", "aprovada", "rejeitada", "cancelada"];
    if (!statusValidos.includes(status)) {
      throw new Error("Status inválido");
    }

    return await this.reservaRepository.updateStatus(id, status);
  }

  // Lista todas as reservas de um usuário específico
  // Valida se o usuário existe antes de buscar as reservas
  async listarReservasPorUsuario(usuarioId) {
    const usuario = await this.usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return await this.reservaRepository.findByUsuario(usuarioId);
  }

  // Lista todas as reservas de uma sala específica
  // Valida se a sala existe antes de buscar as reservas
  async listarReservasPorSala(salaId) {
    const sala = await this.salaRepository.findById(salaId);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    return await this.reservaRepository.findBySala(salaId);
  }
}

module.exports = ReservaService;
