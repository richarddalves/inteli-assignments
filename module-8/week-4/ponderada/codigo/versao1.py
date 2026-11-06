"""A4, versão 1: buffer circular sem sincronização e com corrida no contador."""

from collections import Counter
import threading
import time


N = 4
TOTAL = 20_000
buffer = [None] * N
inicio = 0
fim = 0
ocupadas = 0
produzidas = 0
recebidas = []
parar = threading.Event()
produtor_terminou = threading.Event()


def produzir():
    """Produz IDs no buffer sem proteger o contador compartilhado.

    Parâmetros: nenhum.
    Retorno: nenhum.
    Funcionamento: gera IDs de 0 a TOTAL - 1 e cede a CPU entre a leitura
    e a escrita de ocupadas para expor a condição de corrida.
    """
    global fim, ocupadas, produzidas
    for identificador in range(TOTAL):
        while ocupadas >= N:
            if parar.is_set():
                produtor_terminou.set()
                return
            time.sleep(0)

        buffer[fim] = identificador
        fim = (fim + 1) % N
        produzidas += 1
        valor_lido = ocupadas
        time.sleep(0)  # Interrupção proposital entre leitura e escrita.
        ocupadas = valor_lido + 1
    produtor_terminou.set()


def consumir():
    """Consome os itens que o contador compartilhado indica como disponíveis.

    Parâmetros: nenhum.
    Retorno: True se passar um segundo sem leitura, False se a produção acabar.
    Funcionamento: retira IDs do buffer circular sem sincronização e registra
    cada ID lido em recebidas.
    """
    global inicio, ocupadas
    ultima_leitura = time.monotonic()
    while True:
        if produtor_terminou.is_set() and ocupadas <= 0:
            return False
        if time.monotonic() - ultima_leitura >= 1.0:
            return True
        if ocupadas <= 0:
            time.sleep(0)
            continue

        identificador = buffer[inicio]
        inicio = (inicio + 1) % N
        valor_lido = ocupadas
        time.sleep(0)  # A outra thread pode escrever ocupadas aqui.
        ocupadas = valor_lido - 1
        if identificador is not None:
            recebidas.append(identificador)
            ultima_leitura = time.monotonic()
    return False


def main():
    """Executa a versão com corrida e apresenta o resultado do ensaio.

    Parâmetros: nenhum.
    Retorno: nenhum.
    Funcionamento: inicia o produtor, consome os itens e compara os IDs
    produzidos com os recebidos para contar perdas e duplicações.
    """
    produtor = threading.Thread(target=produzir, daemon=True)
    produtor.start()
    travou = consumir()
    parar.set()
    produtor.join(timeout=0.1)
    contagens = Counter(recebidas)
    unicos = sum(identificador in contagens for identificador in range(produzidas))
    duplicadas = sum(max(0, vezes - 1) for vezes in contagens.values())
    perdidas = produzidas - unicos
    print(f"Versão 1 | N={N} | planejadas={TOTAL} | produzidas={produzidas}")
    print(f"consumidas={len(recebidas)} | perdidas={perdidas} | duplicadas={duplicadas} | travou={'sim' if travou else 'não'}")


if __name__ == "__main__":
    main()
