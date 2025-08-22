# Calculadora de Média, Variância e Desvio Padrão

Projeto do curso Data Analysis with Python do freeCodeCamp.

## Descrição

O programa recebe uma lista de 9 números, transforma em uma matriz 3x3 e calcula:
- Média
- Variância  
- Desvio padrão
- Máximo
- Mínimo
- Soma

Os cálculos são feitos por coluna, por linha e para todos os elementos.

## Como usar

```python
import mean_var_std

resultado = mean_var_std.calculate([0,1,2,3,4,5,6,7,8])
print(resultado)
```

## Requisitos

- Python 3
- NumPy

## Instalação

```bash
pip install numpy
```

## Executar testes

```bash
python main.py
```