const SalaRepository = require("../repositories/SalaRepository");
const ReservaRepository = require("../repositories/ReservaRepository");

class SalaService {
  constructor() {
    this.salaRepository = new SalaRepository();
    this.reservaRepository = new ReservaRepository();
  }

  async criarSala(dados) {
    // Validações de negócio
    const tiposValidos = ["sala_estudo", "cabine"];
    if (!tiposValidos.includes(dados.tipo_sala)) {
      throw new Error("Tipo de sala inválido");
    }

    if (dados.capacidade <= 0) {
      throw new Error("Capacidade deve ser maior que zero");
    }

    // Verificar se já existe uma sala com o mesmo nome
    const salas = await this.salaRepository.findAll();
    const nomeExistente = salas.some((sala) => sala.nome === dados.nome);
    if (nomeExistente) {
      throw new Error("Já existe uma sala com este nome");
    }

    return await this.salaRepository.create(dados);
  }

  async atualizarSala(id, dados) {
    const sala = await this.salaRepository.findById(id);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Validações de negócio
    if (dados.tipo_sala) {
      const tiposValidos = ["sala_estudo", "cabine"];
      if (!tiposValidos.includes(dados.tipo_sala)) {
        throw new Error("Tipo de sala inválido");
      }
    }

    if (dados.capacidade && dados.capacidade <= 0) {
      throw new Error("Capacidade deve ser maior que zero");
    }

    // Se estiver alterando o nome, verificar se já existe
    if (dados.nome && dados.nome !== sala.nome) {
      const salas = await this.salaRepository.findAll();
      const nomeExistente = salas.some((s) => s.nome === dados.nome);
      if (nomeExistente) {
        throw new Error("Já existe uma sala com este nome");
      }
    }

    return await this.salaRepository.update(id, dados);
  }

  async verificarDisponibilidade(salaId, dataInicio, dataFim) {
    const sala = await this.salaRepository.findById(salaId);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Verificar se há reservas no período
    const reservas = await this.reservaRepository.findBySala(salaId);
    const reservasNoPeriodo = reservas.filter((reserva) => {
      const reservaInicio = new Date(reserva.data_inicio);
      const reservaFim = new Date(reserva.data_fim);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      return (
        (inicio >= reservaInicio && inicio < reservaFim) ||
        (fim > reservaInicio && fim <= reservaFim) ||
        (inicio <= reservaInicio && fim >= reservaFim)
      );
    });

    return reservasNoPeriodo.length === 0;
  }

  async listarSalasPorTipo(tipo) {
    const tiposValidos = ["sala_estudo", "cabine"];
    if (!tiposValidos.includes(tipo)) {
      throw new Error("Tipo de sala inválido");
    }

    return await this.salaRepository.findByTipo(tipo);
  }
}

module.exports = SalaService;
