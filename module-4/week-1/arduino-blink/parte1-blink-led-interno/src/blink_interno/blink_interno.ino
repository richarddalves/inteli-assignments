void setup() {
  // Configura o pino do LED interno como saída digital
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Liga o LED (nível lógico alto)
  digitalWrite(LED_BUILTIN, HIGH);
  delay(550);

  // Desliga o LED (nível lógico baixo)
  digitalWrite(LED_BUILTIN, LOW);
  delay(550);
}