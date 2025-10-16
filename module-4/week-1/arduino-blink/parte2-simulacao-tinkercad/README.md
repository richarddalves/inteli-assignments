# Parte 2 — Blink LED Externo (Simulação Tinkercad)

Este projeto faz o **LED externo (off-board)** piscar em intervalos regulares, demonstrando o controle de saída digital no Arduino Uno utilizando um LED montado no protoboard.

## 💡 Descrição
O programa liga e desliga o LED conectado ao pino digital **5** a cada 1 segundo, usando as funções:
- `pinMode()` para definir o pino como saída;
- `digitalWrite()` para alternar o estado do LED;
- `delay()` para criar o intervalo entre as mudanças.

## ⚙️ Código-fonte
O código está localizado em [`src/blink_externo/blink_externo.ino`](src/blink_externo/blink_externo.ino).

## 🔗 Simulação no Tinkercad
O projeto pode ser acessado em:  
[https://www.tinkercad.com/things/bZPmawnISB9-blinkexterno?sharecode=TsNJ7cpTUVoGMih4U0sKPRs9UWq0yc9HRl2hvR2vAAE](https://www.tinkercad.com/things/bZPmawnISB9-blinkexterno?sharecode=TsNJ7cpTUVoGMih4U0sKPRs9UWq0yc9HRl2hvR2vAAE)

## 🧰 Hardware utilizado
- Arduino Uno  
- Protoboard  
- LED 5 mm (externo)  
- Resistor 220–330 Ω  
- Jumpers de conexão
