import numpy as np


def calculate(lista):
    # Verifica se a lista tem exatamente 9 números
    if len(lista) != 9:
        raise ValueError("A lista precisa ter 9 números.")

    # Transforma a lista em uma matriz 3x3
    matriz = np.array(lista).reshape(3, 3)

    # Calcula as estatísticas pedidas
    calculations = {
        # Média: [por coluna, por linha, todos os elementos]
        "mean": [
            matriz.mean(axis=0).tolist(),  # média de cada coluna
            matriz.mean(axis=1).tolist(),  # média de cada linha
            matriz.mean(),  # média de todos os elementos
        ],
        # Variância: [por coluna, por linha, todos os elementos]
        "variance": [
            matriz.var(axis=0).tolist(),
            matriz.var(axis=1).tolist(),
            matriz.var(),
        ],
        # Desvio padrão: [por coluna, por linha, todos os elementos]
        "standard deviation": [
            matriz.std(axis=0).tolist(),
            matriz.std(axis=1).tolist(),
            matriz.std(),
        ],
        # Máximo: [por coluna, por linha, todos os elementos]
        "max": [
            matriz.max(axis=0).tolist(),
            matriz.max(axis=1).tolist(),
            int(matriz.max()),  # converte para int pois o máximo é sempre inteiro
        ],
        # Mínimo: [por coluna, por linha, todos os elementos]
        "min": [
            matriz.min(axis=0).tolist(),
            matriz.min(axis=1).tolist(),
            int(matriz.min()),  # converte para int pois o mínimo é sempre inteiro
        ],
        # Soma: [por coluna, por linha, todos os elementos]
        "sum": [
            matriz.sum(axis=0).tolist(),
            matriz.sum(axis=1).tolist(),
            int(matriz.sum()),  # converte para int pois a soma é sempre inteira
        ],
    }

    return calculations
