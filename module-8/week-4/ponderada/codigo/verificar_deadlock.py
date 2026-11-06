"""Explora todas as ordens possíveis dos P/V da A5 e procura deadlocks."""

from collections import deque


RECURSOS = ("i2c", "log", "ble")
THREADS = ("sensor", "log", "config")
ORIGINAL = (
    (("P", "i2c"), ("P", "log"), ("V", "log"), ("V", "i2c")),
    (("P", "log"), ("P", "ble"), ("V", "ble"), ("V", "log")),
    (("P", "ble"), ("P", "i2c"), ("V", "i2c"), ("V", "ble")),
)
ORDEM_GLOBAL = (
    ORIGINAL[0],
    ORIGINAL[1],
    (("P", "i2c"), ("P", "ble"), ("V", "ble"), ("V", "i2c")),
)


def sucessores(estado, programas):
    """Recebe estado e programas. Retorna os próximos estados e ações possíveis."""
    pcs, donos = estado
    proximos = []
    for numero, programa in enumerate(programas):
        if pcs[numero] == len(programa):
            continue
        operacao, nome_recurso = programa[pcs[numero]]
        indice = RECURSOS.index(nome_recurso)
        if operacao == "P" and donos[indice] != -1:
            continue
        if operacao == "V" and donos[indice] != numero:
            raise ValueError(f"Liberação inválida: {THREADS[numero]} V({nome_recurso})")

        novos_pcs = list(pcs)
        novos_donos = list(donos)
        novos_pcs[numero] += 1
        novos_donos[indice] = numero if operacao == "P" else -1
        acao = f"{THREADS[numero]} {operacao}({nome_recurso})"
        proximos.append(((tuple(novos_pcs), tuple(novos_donos)), acao))
    return proximos


def reconstruir(estado, pais):
    """Recebe o estado final e o mapa de pais. Retorna o caminho mais curto."""
    caminho = []
    while pais[estado] is not None:
        anterior, acao = pais[estado]
        caminho.append(acao)
        estado = anterior
    return list(reversed(caminho))


def esperas(estado, programas):
    """Recebe estado e programas. Retorna as esperas por recurso no deadlock."""
    pcs, donos = estado
    linhas = []
    for numero, programa in enumerate(programas):
        if pcs[numero] == len(programa):
            continue
        operacao, recurso = programa[pcs[numero]]
        if operacao != "P":
            raise ValueError("Estado sem transições por motivo diferente de P bloqueado")
        dono = donos[RECURSOS.index(recurso)]
        linhas.append(f"{THREADS[numero]} espera {recurso}, em posse de {THREADS[dono]}")
    return linhas


def explorar(programas):
    """Recebe programas P/V. Retorna total de estados, deadlocks e menor exemplo."""
    inicial = ((0, 0, 0), (-1, -1, -1))
    fila = deque([inicial])
    pais = {inicial: None}
    deadlocks = []
    completos = 0
    while fila:
        estado = fila.popleft()
        pcs, _ = estado
        if all(pcs[i] == len(programas[i]) for i in range(len(THREADS))):
            completos += 1
            continue
        proximos = sucessores(estado, programas)
        if not proximos:
            deadlocks.append(estado)
        for proximo, acao in proximos:
            if proximo not in pais:
                pais[proximo] = (estado, acao)
                fila.append(proximo)
    exemplo = None
    if deadlocks:
        exemplo = (reconstruir(deadlocks[0], pais), esperas(deadlocks[0], programas))
    return len(pais), len(deadlocks), completos, exemplo


def mostrar(nome, programas):
    """Recebe nome e programas. Imprime a exploração e não retorna valor."""
    estados, travamentos, completos, exemplo = explorar(programas)
    print(f"{nome}: estados={estados}, deadlocks={travamentos}, finais={completos}")
    if exemplo:
        caminho, bloqueios = exemplo
        print("Menor entrelaçamento que trava:")
        for passo, acao in enumerate(caminho, 1):
            print(f"  {passo}. {acao}")
        for bloqueio in bloqueios:
            print(f"  {bloqueio}")


def main():
    """Executa os dois modelos. Não recebe parâmetros nem retorna valor."""
    mostrar("Código original", ORIGINAL)
    mostrar("Ordem global i2c < log < ble", ORDEM_GLOBAL)
    print("Escopo: P/V e exclusão mútua. O modelo não mede tempo nem E/S.")


if __name__ == "__main__":
    main()
