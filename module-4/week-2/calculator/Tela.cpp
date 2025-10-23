#include "Tela.h"

Tela::Tela(uint8_t rs, uint8_t en, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7)
  : lcd(rs, en, d4, d5, d6, d7) {}

void Tela::begin(uint8_t cols, uint8_t rows) {
  lcd.begin(cols, rows);
}

void Tela::showSpalshScreen() {
  lcd.print("GoodArduinoCode");
  lcd.setCursor(3, 1);
  String message = "Calculator";
  for (byte i = 0; i < message.length(); i++) {
    lcd.print(message[i]);
    delay(50);
  }
  delay(500);
}

void Tela::updateCursor() {
  if (millis() / 250 % 2 == 0 ) {
    lcd.cursor();
  } else {
    lcd.noCursor();
  }
}

void Tela::print(const String& s) { lcd.print(s); }
void Tela::print(char c)          { lcd.print(c); }
void Tela::setCursor(uint8_t col, uint8_t row) { lcd.setCursor(col, row); }
void Tela::clear()  { lcd.clear(); }
void Tela::cursor() { lcd.cursor(); }
void Tela::noCursor() { lcd.noCursor(); }
