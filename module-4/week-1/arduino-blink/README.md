# Projeto — Blink com Arduino Uno

Este repositório contém dois projetos práticos que demonstram o funcionamento básico das **saídas digitais** no **Arduino Uno**, utilizando LEDs internos e externos para simular o comportamento de um pisca-pisca.

## 🧩 Estrutura do repositório
```
arduino-blink/
├── parte1-blink-led-interno/
│   ├── assets/
│   │   ├── print_ide.png
│   │   ├── foto_horizontal.jpeg
│   │   ├── foto_vertical.jpeg
│   │   └── video.mp4
│   ├── src/
│   │   └── blink_interno/
│   │       └── blink_interno.ino
│   └── README.md
│
└── parte2-simulacao-tinkercad/
    ├── src/
    │   └── blink_externo/
    │       └── blink_externo.ino
    └── README.md
```

## 💡 Descrição geral
- **Parte 1 – Blink LED Interno:**  
  Utiliza o **LED embutido** no Arduino Uno para demonstrar o controle digital básico.

- **Parte 2 – Blink LED Externo:**  
  Simula, no **Tinkercad**, um **LED off-board** montado no **protoboard**, controlado pelo Arduino através de um pino digital.

## 🧰 Hardware utilizado
- Arduino Uno  
- Cabo USB  
- Protoboard
- LED
- Resistor (220–330 Ω)
- Jumpers  

## 📚 Objetivo didático
Esses experimentos introduzem os conceitos fundamentais de:
- Saída digital (`digitalWrite`)
- Configuração de pinos (`pinMode`)
- Controle de tempo (`delay`)
