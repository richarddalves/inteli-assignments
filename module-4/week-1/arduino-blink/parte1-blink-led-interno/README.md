# Parte 1 — Blink LED Interno

Este projeto faz o **LED interno do Arduino Uno** piscar em intervalos regulares, demonstrando o funcionamento básico de entrada e saída digital na placa.

## 💡 Descrição
O programa liga e desliga o LED embutido (`LED_BUILTIN`) a cada 550ms, utilizando as funções:
- `pinMode()` para configurar o pino como saída;
- `digitalWrite()` para alterar o estado do LED;
- `delay()` para criar o intervalo entre os estados.

## ⚙️ Código-fonte
O código está localizado em [`src/blink_interno/blink_interno.ino`](src/blink_interno/blink_interno.ino).

## 🖼️ Evidências
As evidências do funcionamento estão na pasta [`assets/`](assets/):
- Fotos horizontais e verticais do LED aceso;
- Captura de tela do código na IDE;
- Vídeo demonstrando o pisca-pisca em execução.

## 🧰 Hardware utilizado
- Arduino Uno  
- Cabo USB para conexão
