// C++ code
//
void setup() {
  // Configura o pino do LED interno como saída digital
  pinMode(5, OUTPUT);
}

void loop() {
  // Liga o LED e aguarda 1s
  digitalWrite(5, HIGH);
  delay(1000);

  // Desliga o LED e aguarda 1s
  digitalWrite(5, LOW);
  delay(1000);
}