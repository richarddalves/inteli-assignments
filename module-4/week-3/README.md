# Semáforo ESP32 com Display LCD
<center>

![INTELI](https://img.shields.io/badge/Inteli-231C30?style=for-the-badge&label=Modulo%204&labelColor=FFFFFF)
<br>
![ESP32](https://img.shields.io/badge/ESP32-000000?style=for-the-badge&logo=espressif&logoColor=white)
![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
</center>

Projeto desenvolvido como exercício da semana 3 do módulo 4 de Engenharia da Computação no Inteli.

## Sobre

Sistema de semáforo automático que alterna entre três estados com durações específicas e exibe informações em tempo real em um display LCD.

**Tempos de cada estado:**
- Vermelho: 6 segundos
- Verde: 4 segundos
- Amarelo: 2 segundos

## Demonstração

### Vídeo

<!-- INSTRUÇÕES: Grave um vídeo de 1-2 minutos mostrando:
1. Você aparecendo no início do vídeo (para comprovar autoria)
2. A protoboard montada com todos os componentes visíveis
3. O semáforo funcionando por pelo menos dois ciclos completos
4. O display LCD mostrando as mensagens e contagem regressiva
5. Cronômetro visível comprovando os tempos corretos
Faça upload no YouTube como não listado e cole o link abaixo -->

[▶️ Assistir demonstração](URL_DO_VIDEO_AQUI)

### Simulação Online

Teste o projeto no simulador Wokwi sem precisar montar o circuito físico.

[🔗 Abrir no Wokwi](https://wokwi.com/projects/446263826837972993)

### Circuito

![Circuito no Wokwi](assets/circuito-wokwi.png)

## Componentes

| Quantidade | Componente | Especificação |
|:---:|---|---|
| 1 | ESP32 DevKit C V4 | Microcontrolador 240MHz |
| 1 | LED Vermelho | 5mm, 2V, 20mA |
| 1 | LED Amarelo | 5mm, 2V, 20mA |
| 1 | LED Verde | 5mm, 2V, 20mA |
| 3 | Resistor | 220Ω, 1/4W |
| 1 | Display LCD 16x2 | Interface I2C (0x27) |
| 1 | Protoboard | 830 pontos |

## Montagem

Consulte o [TUTORIAL.md](TUTORIAL.md) para instruções detalhadas de montagem com imagens passo a passo.

### Pinagem

| Pino ESP32 | Conexão |
|---|---|
| GPIO 13 | LED Vermelho |
| GPIO 12 | LED Amarelo |
| GPIO 14 | LED Verde |
| GPIO 21 | SDA (Display) |
| GPIO 22 | SCL (Display) |
| 3V3 | Alimentação (+) |
| GND | Terra (-) |

## Como Usar

1. Clone este repositório
2. Abra `src/sketch.ino` na Arduino IDE
3. Instale a biblioteca `LiquidCrystal I2C`
4. Conecte o ESP32 via USB
5. Selecione a placa `ESP32 Dev Module`
6. Faça o upload do código

## Estrutura de Arquivos
```
semaforo/
├── README.md
├── TUTORIAL.md          
├── assets/              
├── src/
│   ├── sketch.ino
│   ├── LuzSemaforo.h
│   ├── LuzSemaforo.cpp
│   ├── config.h
│   ├── diagram.json
│   └── libraries.txt
└── doc/
    └── documentacao.md
```

## Avaliação

Esta atividade foi avaliada por dois colegas de turma.

<!-- INSTRUÇÕES: Após receber as avaliações, preencha abaixo -->

**Avaliador 1:** [NOME_COMPLETO]  
Comentários: [COMENTARIOS]

**Avaliador 2:** [NOME_COMPLETO]  
Comentários: [COMENTARIOS]

## Autor

**Richard Alves**  
Engenharia da Computação - Inteli  
Módulo 4, Semana 3 | 2025

## Licença

Projeto educacional de código aberto.