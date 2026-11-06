"""A4, versão 3: ordem invertida dos semáforos produz deadlock."""

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
    """Produz IDs com a ordem de aquisição que provoca o travamento.

    Parâmetros: nenhum.
    Retorno: nenhum enquanto a thread está bloqueada. Se terminar, retorna None.
    Funcionamento: adquire o mutex antes de esperar uma vaga. Com o buffer
    cheio, segura o mutex e impede o consumidor de liberar uma vaga.
    """
    global fim, produzidas
    for identificador in range(TOTAL):
        mutex.acquire()  # Ordem invertida: pode bloquear segurando mutex.
        vazio.acquire()
        buffer[fim] = identificador
        fim = (fim + 1) % N
        produzidas += 1
        mutex.release()
        cheio.release()


def consumir():
    """Tenta consumir os IDs enquanto o produtor pode segurar o mutex.

    Parâmetros: nenhum.
    Retorno: True se uma espera exceder um segundo, False após TOTAL leituras.
    Funcionamento: espera um item cheio, tenta obter o mutex com limite de
    tempo e registra cada ID que conseguir retirar do buffer.
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
    """Executa a versão travada e apresenta o resultado do ensaio.

    Parâmetros: nenhum.
    Retorno: nenhum.
    Funcionamento: inicia o produtor, aguarda o buffer encher, tenta
    consumir e compara os IDs produzidos com os recebidos.
    """
    produtor = threading.Thread(target=produzir, daemon=True)
    produtor.start()
    time.sleep(0.02)  # Mesmo início de consumo usado na versão 2.
    travou = consumir()
    produtor.join(timeout=1)
    contagens = Counter(recebidas)
    unicos = sum(identificador in contagens for identificador in range(produzidas))
    duplicadas = sum(max(0, vezes - 1) for vezes in contagens.values())
    perdidas = produzidas - unicos
    print(f"Versão 3 | N={N} | planejadas={TOTAL} | produzidas={produzidas}")
    print(f"consumidas={len(recebidas)} | perdidas={perdidas} | duplicadas={duplicadas} | travou={'sim' if travou else 'não'}")


if __name__ == "__main__":
    main()
