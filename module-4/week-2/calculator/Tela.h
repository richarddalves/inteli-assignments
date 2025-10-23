#pragma once
#include <Arduino.h>
#include <LiquidCrystal.h>

class Tela {
public:
  // Mesmo hardware do código original
  Tela(uint8_t rs, uint8_t en, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7);

  void begin(uint8_t cols, uint8_t rows);

  // Mantém o mesmo comportamento/funções do código original
  void showSpalshScreen();
  void updateCursor();

  // Encapsulam chamadas diretas ao LCD
  void print(const String& s);
  void print(char c);
  void setCursor(uint8_t col, uint8_t row);
  void clear();
  void cursor();
  void noCursor();

private:
  LiquidCrystal lcd;
};
