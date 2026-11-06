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
