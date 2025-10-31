#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#include "config.h"
#include "LuzSemaforo.h"

// Inicialização do display LCD I2C
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Criação dos objetos que representam cada luz do semáforo
LuzSemaforo luzVerde(PIN_LED_VERDE);
LuzSemaforo luzAmarela(PIN_LED_AMARELO);
LuzSemaforo luzVermelha(PIN_LED_VERMELHO);

// Enumeração dos possíveis estados do semáforo
enum EstadoSemaforo {
  VERDE,
  AMARELO,
  VERMELHO
};

// Variáveis globais de controle
EstadoSemaforo estadoAtual;
unsigned long momentoInicio;
int ultimoSegundoMostrado;

void setup() {
  // Inicialização do display LCD
  lcd.init();
  
  // Inicialização de todas as luzes do semáforo
  luzVerde.init();
  luzAmarela.init();
  luzVermelha.init();

  // Configuração do estado inicial como vermelho
  estadoAtual = VERMELHO;
  luzVermelha.ligar();
  momentoInicio = millis();
  ultimoSegundoMostrado = -1;
  mostrarMensagem(obterMensagemEstado(estadoAtual), String(obterDuracaoEstado(VERMELHO)/1000));
}

void loop() {
  unsigned long momentoAtual = millis();
  unsigned long duracaoPermitida = obterDuracaoEstado(estadoAtual);

  // Verificação se é hora de mudar de estado
  if (momentoAtual - momentoInicio >= duracaoPermitida) {

    // Transição para o próximo estado baseado no estado atual
    switch (estadoAtual) {
      case VERDE:
        mudarParaProximoEstado(luzVerde, luzAmarela, AMARELO);
      break;
      
      case AMARELO:
        mudarParaProximoEstado(luzAmarela, luzVermelha, VERMELHO);
      break;

      case VERMELHO:
        mudarParaProximoEstado(luzVermelha, luzVerde, VERDE);
      break;
    }

    // Atualização da duração após mudança de estado
    duracaoPermitida = obterDuracaoEstado(estadoAtual);
  }

  // Cálculo do tempo restante para exibição no display
  unsigned long tempoRestante = duracaoPermitida - (momentoAtual - momentoInicio);
  int segundosRestantes = (tempoRestante + 999) / 1000;
  
  // Atualização do display apenas quando o segundo muda
  if (segundosRestantes != ultimoSegundoMostrado) {
    mostrarMensagem(obterMensagemEstado(estadoAtual), String(segundosRestantes));
    ultimoSegundoMostrado = segundosRestantes;
  }
}

// Função para exibir mensagem no display LCD
void mostrarMensagem(String linha1, String linha2) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(linha1);
  lcd.setCursor(0, 1);
  lcd.print(linha2);
}

// Função que retorna a duração de cada estado em milissegundos
unsigned long obterDuracaoEstado(EstadoSemaforo estado) {
  switch (estado) {
    case VERMELHO:
      return DURACAO_VERMELHO;
    case VERDE:
      return DURACAO_VERDE;
    case AMARELO:
      return DURACAO_AMARELO;
  }
}

// Função que retorna a mensagem a ser exibida para cada estado
String obterMensagemEstado(EstadoSemaforo estado) {
  switch (estado) {
    case VERMELHO:
      return "PARE";
    case VERDE:
      return "SIGA";
    case AMARELO:
      return "ATENCAO";
  }
}

// Função que realiza a transição entre estados do semáforo
void mudarParaProximoEstado(LuzSemaforo& luzAtual, LuzSemaforo& proximaLuz, EstadoSemaforo proximoEstado) {
  luzAtual.desligar();
  estadoAtual = proximoEstado;
  proximaLuz.ligar();
  momentoInicio = millis();
  ultimoSegundoMostrado = -1;
}