#ifndef LUZSEMAFORO_H
#define LUZSEMAFORO_H

#include <Arduino.h>

// Classe que representa uma luz individual do semáforo
class LuzSemaforo {
  private:
    int pin; // Pino GPIO conectado ao LED

  public:
    // Construtor que recebe o número do pino
    LuzSemaforo(int pinNumber);

    // Inicializa o pino como saída
    void init();

    // Liga o LED
    void ligar();

    // Desliga o LED
    void desligar();

    // Retorna se o LED está ligado
    bool estaLigada();
};

#endif