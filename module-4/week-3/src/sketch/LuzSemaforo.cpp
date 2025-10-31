#include "LuzSemaforo.h"

// Construtor que inicializa o pino
LuzSemaforo::LuzSemaforo(int pinNumber) : pin(pinNumber) {}

// Configura o pino como saída e garante que começa desligado
void LuzSemaforo::init() {
  pinMode(pin, OUTPUT);
  desligar();
}

// Acende o LED colocando o pino em HIGH
void LuzSemaforo::ligar() {
  digitalWrite(pin, HIGH);
}

// Apaga o LED colocando o pino em LOW
void LuzSemaforo::desligar() {
  digitalWrite(pin, LOW);
}

// Verifica se o LED está ligado lendo o estado do pino
bool LuzSemaforo::estaLigada() {
  return digitalRead(pin) == HIGH;
}