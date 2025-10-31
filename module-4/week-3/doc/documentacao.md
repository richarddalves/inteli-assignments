# Documentação Técnica

Detalhes de implementação e funcionamento interno do sistema.

## Objetivo

Praticar conceitos de programação de microcontroladores: controle de GPIO, comunicação I2C, temporização não-bloqueante e máquinas de estado.

---

## Arquitetura

### Classe LuzSemaforo

Encapsula o comportamento de um LED individual.

**Responsabilidades:**
- Controlar estado de um LED em um pino GPIO específico
- Configurar pino como saída
- Fornecer interface para ligar, desligar e verificar estado

**Métodos:**
- `LuzSemaforo(int pinNumber)` - construtor
- `void init()` - configura pino como OUTPUT
- `void ligar()` - acende LED (HIGH)
- `void desligar()` - apaga LED (LOW)
- `bool estaLigada()` - retorna estado atual

### Configuração (config.h)

Centraliza constantes do projeto para facilitar ajustes.

**Constantes:**
- Durações dos estados em milissegundos
- Pinagens dos LEDs
- Pinagem do botão (para expansão futura)

### Programa Principal (sketch.ino)

Implementa a máquina de estados e controle temporal não-bloqueante.

---

## Máquina de Estados

O semáforo opera em três estados que se repetem em ciclo:

**Estado VERMELHO**
- Luz vermelha acesa
- Duração: 6000ms
- Display: "PARE"
- Próximo: VERDE

**Estado VERDE**
- Luz verde acesa
- Duração: 4000ms
- Display: "SIGA"
- Próximo: AMARELO

**Estado AMARELO**
- Luz amarela acesa
- Duração: 2000ms
- Display: "ATENCAO"
- Próximo: VERMELHO

---

## Temporização Não-Bloqueante

O sistema usa `millis()` ao invés de `delay()` para permitir execução simultânea de tarefas.

**Funcionamento:**

A variável `momentoInicio` armazena quando o estado atual começou. A cada iteração do loop, o sistema calcula o tempo decorrido subtraindo `momentoInicio` do tempo atual. Quando esse tempo atinge ou supera a duração do estado, uma transição é realizada e `momentoInicio` é atualizado.

**Vantagem sobre delay():**

O `delay()` bloqueia completamente o programa durante a espera. Com `millis()`, o programa continua executando, permitindo atualizar o display e preparar para futuras expansões como detecção de botão.

---

## Atualização do Display

O display é atualizado de forma eficiente para evitar piscamentos.

**Estratégia:**

O sistema calcula quantos segundos restam no estado atual. Compara esse valor com `ultimoSegundoMostrado`. Apenas atualiza o display quando o valor realmente muda. Após cada transição de estado, `ultimoSegundoMostrado` é reinicializado com -1 para forçar atualização imediata.

**Arredondamento:**

O cálculo adiciona 999ms antes de dividir por 1000. Isso garante arredondamento para cima, então o display mostra 1 segundo enquanto faltar qualquer quantidade de tempo, não apenas exatamente 1000ms.

---

## Funções Auxiliares

**`obterDuracaoEstado(EstadoSemaforo estado)`**

Retorna a duração do estado fornecido. Centraliza o mapeamento estado-duração, facilitando alterações futuras.

**`obterMensagemEstado(EstadoSemaforo estado)`**

Retorna a mensagem apropriada para o display. Centraliza o mapeamento estado-mensagem.

**`mudarParaProximoEstado(...)`**

Encapsula toda a lógica de transição. Garante que ações necessárias são executadas na ordem correta: desligar luz atual, atualizar estado, ligar nova luz, reiniciar cronômetro, forçar atualização do display.


**`mostrarMensagem(String linha1, String linha2)`**

Abstrai a comunicação com o LCD. Facilita eventual troca de tipo de display no futuro.

---

## Comunicação I2C

**Protocolo:** I2C para comunicação com display LCD

**Configuração:**
- Endereço: 0x27
- SDA: GPIO 21
- SCL: GPIO 22
- Velocidade: 100kHz (padrão)

A biblioteca LiquidCrystal I2C gerencia toda a complexidade da comunicação, fornecendo interface simples para controle.

---

## Fluxo de Execução

### Setup (executa uma vez)

Inicializa comunicação I2C e display. Configura pinos dos LEDs como saída. Define estado inicial como VERMELHO. Acende luz vermelha. Marca momento de início. Inicializa variável de controle do display. Exibe mensagem inicial.

### Loop (executa continuamente)

Captura timestamp atual. Obtém duração do estado atual. Calcula tempo decorrido. Verifica se é hora de mudar de estado. Se sim, determina próximo estado e executa transição. Calcula segundos restantes. Se o valor mudou, atualiza display.

Este loop executa milhares de vezes por segundo, garantindo resposta rápida e contagem precisa.

---

## Desafios Resolvidos

**Primeiro segundo não aparecia:**

A variável `ultimoSegundoMostrado` era inicializada com o valor correto do estado. Quando o programa calculava os segundos restantes, o valor era igual, então o display não atualizava. Solução: inicializar com -1 para forçar primeira atualização.

**Display piscando:**

A função `mostrarMensagem()` chama `lcd.clear()` que leva alguns milissegundos. Uma solução melhor seria remover o clear e adicionar espaços no final das linhas para limpar caracteres residuais.

---

## Expansões Possíveis

O código está estruturado para facilitar adições futuras:

[ ] **Botão de pedestre:** Permitir solicitação de tempo de travessia. A pinagem já está definida em config.h.


---

## Recursos do Sistema

**Uso de memória:**
- Flash: ~30KB (< 1% do ESP32)
- RAM: ~5KB (< 1% do ESP32)
- Pinos GPIO: 5 usados, 27 disponíveis

O sistema é extremamente eficiente, deixando amplo espaço para expansões.

---

## Considerações de Segurança

Estado inicial sempre VERMELHO para priorizar segurança. Transições seguem sequência padrão de semáforos reais. Impossível ter múltiplas luzes acesas simultaneamente.