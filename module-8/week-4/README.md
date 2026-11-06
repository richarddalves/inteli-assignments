# Ponderada CC08: do pipeline ao deadlock

Richard Dias Alves

Análise de uma pulseira sensorial com prazo de 5 ms por amostra, simulação de semáforos e decisão de arquitetura.

O texto da entrega está em [ponderada/ponderada-tato.md](ponderada/ponderada-tato.md). Os prints ficam em `ponderada/img`.

## Rodar a questão A4

Use Python 3. Não há dependências externas. A partir desta pasta, rode cada versão com um comando:

```bash
python3 ponderada/codigo/versao1.py
python3 ponderada/codigo/versao2.py
python3 ponderada/codigo/versao3.py
```

Cada comando tenta trabalhar com 20.000 amostras e N = 4. A versão 1 força uma troca de thread entre a leitura e a escrita do contador. Nas versões 2 e 3, o consumidor começa 20 ms depois do produtor para encontrar o buffer cheio. A diferença na lógica do produtor é a ordem entre `vazio` e `mutex`. A versão 3 encerra a observação após 1 segundo sem consumo, embora o produtor continue bloqueado até o processo sair.

Para repetir as nove rodadas da tabela, execute cada comando três vezes. Os resultados da versão 1 dependem da ordem em que o sistema alterna as threads e podem variar. O [print completo](ponderada/img/a4-nove-execucoes.png) guarda as rodadas usadas na entrega.

## Verificações adicionais

A exploração de estados da A5 compara o código original com a ordem global de locks:

```bash
python3 ponderada/codigo/verificar_deadlock.py
```

O validador de prazo aceita um CSV com as colunas `id,sensor_us,motor_us`. Os tempos usam microssegundos desde o início da captura, e os IDs começam em zero. A primeira opção abaixo demonstra o relatório com dados **sintéticos**. A segunda é o comando para analisar uma captura real de um milhão de amostras, quando ela existir:

```bash
python3 ponderada/codigo/validar_prazo.py --demo
python3 ponderada/codigo/validar_prazo.py captura.csv --esperadas 1000000
```

O programa retorna código de saída 1 quando encontra IDs ausentes ou repetidos, latência acima de 5.000 µs ou ordem temporal inválida. Ele informa o desvio do período de 10.000 µs. Para transformá-lo em critério de aprovação, acrescente `--tolerancia-periodo-us` com o limite escolhido para o ensaio.

Os sete testes dos verificadores rodam com:

```bash
python3 -m unittest discover -s ponderada/codigo -p test_verificacoes.py -v
```
