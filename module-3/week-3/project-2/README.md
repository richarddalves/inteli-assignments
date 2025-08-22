# Analisador de Dados Demográficos

Projeto do curso Data Analysis with Python do freeCodeCamp.

## Descrição

Análise de dados do censo de 1994 usando Pandas. O programa responde várias perguntas sobre os dados demográficos como idade média, educação, salários e países.

## Dataset

O arquivo `adult.data.csv` contém dados de 32.561 pessoas com informações sobre:
- Idade, sexo, raça
- Educação e ocupação
- Horas trabalhadas por semana
- País de origem
- Salário (>50K ou <=50K)

## Perguntas Respondidas

1. Quantas pessoas de cada raça estão no dataset
2. Idade média dos homens
3. Porcentagem de pessoas com bacharelado
4. Porcentagem de pessoas com educação avançada que ganham >50K
5. Porcentagem de pessoas sem educação avançada que ganham >50K
6. Número mínimo de horas trabalhadas por semana
7. Porcentagem de pessoas que trabalham mínimo de horas e ganham >50K
8. País com maior porcentagem de pessoas ricas
9. Ocupação mais popular na Índia para quem ganha >50K

## Como usar

```python
import demographic_data_analyzer

resultado = demographic_data_analyzer.calculate_demographic_data()
```

## Requisitos

- Python 3
- Pandas

## Instalação

```bash
pip install -r requirements.txt
```

## Executar testes

```bash
python main.py
```