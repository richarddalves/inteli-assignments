"""A4, versão 2: buffer circular com semáforos na ordem correta."""

from collections import Counter
import threading
import time


N = 4
TOTAL = 20_000
buffer = [None] * N
inicio = 0
fim = 0
produzidas = 0
recebidas = []
vazio = threading.Semaphore(N)
cheio = threading.Semaphore(0)
mutex = threading.Semaphore(1)


def produzir():
    """Produz IDs respeitando a capacidade do buffer circular.

    Parâmetros: nenhum.
    Retorno: nenhum.
    Funcionamento: gera TOTAL IDs. Para cada item, espera uma vaga, adquire
    o mutex, escreve, libera o mutex e sinaliza um item cheio.
    """
    global fim, produzidas
    for identificador in range(TOTAL):
        vazio.acquire()
        mutex.acquire()
        buffer[fim] = identificador
        fim = (fim + 1) % N
        produzidas += 1
        mutex.release()
        cheio.release()


def consumir():
    """Consome os IDs com a mesma ordem segura de sincronização.

    Parâmetros: nenhum.
    Retorno: True se uma espera exceder um segundo, False após TOTAL leituras.
    Funcionamento: espera um item cheio antes de adquirir o mutex, retira o
    ID, libera a região crítica e sinaliza a vaga vazia.
    """
    global inicio
    for _ in range(TOTAL):
        if not cheio.acquire(timeout=1):
            return True
        if not mutex.acquire(timeout=1):
            return True
        identificador = buffer[inicio]
        inicio = (inicio + 1) % N
        mutex.release()
        vazio.release()
        recebidas.append(identificador)
    return False


def main():
    """Executa a versão sincronizada e apresenta o resultado do ensaio.

    Parâmetros: nenhum.
    Retorno: nenhum.
    Funcionamento: inicia o produtor, aguarda o buffer encher, consome os
    itens e compara os IDs produzidos com os recebidos.
    """
    produtor = threading.Thread(target=produzir, daemon=True)
    produtor.start()
    time.sleep(0.02)  # Começa o consumo com o buffer cheio.
    travou = consumir()
    produtor.join(timeout=1)
    contagens = Counter(recebidas)
    unicos = sum(identificador in contagens for identificador in range(produzidas))
    duplicadas = sum(max(0, vezes - 1) for vezes in contagens.values())
    perdidas = produzidas - unicos
    print(f"Versão 2 | N={N} | planejadas={TOTAL} | produzidas={produzidas}")
    print(f"consumidas={len(recebidas)} | perdidas={perdidas} | duplicadas={duplicadas} | travou={'sim' if travou else 'não'}")


if __name__ == "__main__":
    main()
