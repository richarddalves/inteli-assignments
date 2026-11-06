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
    """Sem parâmetros. Tenta gerar TOTAL IDs com a ordem invertida. Não retorna valor."""
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
    """Sem parâmetros. Retira TOTAL IDs. Retorna True se ficar 1 s sem item."""
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
    """Executa o ensaio e imprime contagens. Não recebe nem retorna valores."""
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
