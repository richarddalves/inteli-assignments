"""Valida IDs e latência de uma captura CSV do caminho sensor-motor."""

import argparse
import csv
from pathlib import Path


PRAZO_US = 5_000
PERIODO_US = 10_000


def ler_csv(caminho):
    """Lê uma captura CSV sem carregar o arquivo inteiro na memória.

    Parâmetros: caminho é um Path para o CSV da captura.
    Retorno: iterador de tuplas (id, sensor_us, motor_us), com inteiros.
    Funcionamento: exige as três colunas, converte os valores para inteiros
    não negativos e informa a linha quando encontra um dado inválido.
    """
    with caminho.open(newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)
        campos = {"id", "sensor_us", "motor_us"}
        if leitor.fieldnames is None or not campos.issubset(leitor.fieldnames):
            raise ValueError("O CSV precisa das colunas id,sensor_us,motor_us")
        for numero, linha in enumerate(leitor, 2):
            try:
                valores = tuple(int(linha[campo]) for campo in ("id", "sensor_us", "motor_us"))
            except (ValueError, TypeError) as erro:
                raise ValueError(f"Linha {numero}: use inteiros em microssegundos") from erro
            if min(valores) < 0:
                raise ValueError(f"Linha {numero}: valores negativos")
            yield valores


def avaliar(linhas, esperadas, tolerancia_periodo_us=None):
    """Avalia prazo, integridade e ordem de uma captura do sensor ao motor.

    Parâmetros: linhas contém tuplas (id, sensor_us, motor_us), esperadas é
    a quantidade planejada de IDs a partir de zero e tolerancia_periodo_us
    é o maior desvio permitido dos 10.000 µs entre amostras consecutivas.
    Retorno: dicionário com contagens, pior latência, exemplos de falhas e
    aprovado, que só é True quando todas as regras exigidas passam.
    Funcionamento: percorre as linhas uma vez, marca os IDs vistos e calcula
    as falhas de prazo, sequência e período. Depois conta os IDs ausentes.
    """
    if esperadas <= 0:
        raise ValueError("O total esperado precisa ser positivo")
    if tolerancia_periodo_us is not None and tolerancia_periodo_us < 0:
        raise ValueError("A tolerância de período não pode ser negativa")
    vistos = bytearray(esperadas)
    total = duplicadas = fora_da_faixa = invalidas = atrasadas = 0
    id_fora_de_ordem = tempo_fora_de_ordem = maior_desvio = 0
    exemplos_atrasados = []
    pior = anterior = None
    for identificador, sensor, motor in linhas:
        total += 1
        if identificador >= esperadas:
            fora_da_faixa += 1
        elif vistos[identificador]:
            duplicadas += 1
        else:
            vistos[identificador] = 1
        latencia = motor - sensor
        if latencia < 0:
            invalidas += 1
        elif pior is None or latencia > pior[1]:
            pior = (identificador, latencia)
        if latencia > PRAZO_US:
            atrasadas += 1
            if len(exemplos_atrasados) < 8:
                exemplos_atrasados.append((identificador, latencia))
        if anterior is not None:
            id_anterior, sensor_anterior = anterior
            id_fora_de_ordem += identificador <= id_anterior
            tempo_fora_de_ordem += sensor <= sensor_anterior
            if identificador == id_anterior + 1:
                maior_desvio = max(maior_desvio, abs(sensor - sensor_anterior - PERIODO_US))
        anterior = (identificador, sensor)
    ausentes = vistos.count(0)
    exemplos_ausentes = []
    for i, visto in enumerate(vistos):
        if not visto:
            exemplos_ausentes.append(i)
            if len(exemplos_ausentes) == 8:
                break
    periodo_falhou = (
        tolerancia_periodo_us is not None and maior_desvio > tolerancia_periodo_us
    )
    aprovado = not (
        ausentes or duplicadas or fora_da_faixa or invalidas or atrasadas
        or id_fora_de_ordem or tempo_fora_de_ordem or periodo_falhou
    )
    return {
        "linhas": total,
        "esperadas": esperadas,
        "ausentes": ausentes,
        "exemplos_ausentes": exemplos_ausentes,
        "duplicadas": duplicadas,
        "fora_da_faixa": fora_da_faixa,
        "invalidas": invalidas,
        "atrasadas": atrasadas,
        "exemplos_atrasados": exemplos_atrasados,
        "pior": pior,
        "desvio_periodo": maior_desvio,
        "id_fora_de_ordem": id_fora_de_ordem,
        "tempo_fora_de_ordem": tempo_fora_de_ordem,
        "periodo_falhou": periodo_falhou,
        "aprovado": aprovado,
    }


def mostrar(nome, resultado):
    """Mostra no terminal as métricas de uma captura avaliada.

    Parâmetros: nome identifica a captura e resultado é o dicionário
    produzido por avaliar.
    Retorno: nenhum.
    Funcionamento: imprime a aprovação, as contagens de falhas e a pior
    latência observada.
    """
    print(f"{nome}: {'APROVADO' if resultado['aprovado'] else 'REPROVADO'}")
    print(f"  linhas={resultado['linhas']}, esperadas={resultado['esperadas']}")
    print(
        f"  ausentes={resultado['ausentes']} {resultado['exemplos_ausentes']}, "
        f"duplicadas={resultado['duplicadas']}, fora_da_faixa={resultado['fora_da_faixa']}"
    )
    print(
        f"  atrasadas={resultado['atrasadas']} {resultado['exemplos_atrasados']}, "
        f"latencias_invalidas={resultado['invalidas']}"
    )
    print(
        f"  pior_latencia_us={resultado['pior']}, "
        f"maior_desvio_periodo_us={resultado['desvio_periodo']}, "
        f"id_fora_de_ordem={resultado['id_fora_de_ordem']}, "
        f"tempo_fora_de_ordem={resultado['tempo_fora_de_ordem']}"
    )


def demonstrar():
    """Exercita o validador com dois exemplos sintéticos.

    Parâmetros: nenhum.
    Retorno: 0 se a captura boa passar e a defeituosa falhar, 1 caso contrário.
    Funcionamento: cria uma sequência dentro do prazo e outra com atraso,
    perda e duplicação, avalia ambas e imprime os resultados.
    """
    boas = [(i, i * PERIODO_US, i * PERIODO_US + 4_200) for i in range(8)]
    ruins = [linha for linha in boas if linha[0] != 5]
    ruins = [
        (i, sensor, sensor + 5_075) if i == 2 else (i, sensor, motor)
        for i, sensor, motor in ruins
    ]
    ruins.append((6, 60_001, 64_201))
    ruins.sort(key=lambda linha: linha[1])
    aprovado = avaliar(boas, 8)
    reprovado = avaliar(ruins, 8)
    print("DEMONSTRAÇÃO SINTÉTICA: estes dados não vieram da pulseira física")
    mostrar("Captura sem falhas", aprovado)
    mostrar("Captura com prazo, perda e duplicação", reprovado)
    return 0 if aprovado["aprovado"] and not reprovado["aprovado"] else 1


def main():
    """Processa a linha de comando do validador de prazo.

    Parâmetros: nenhum em Python. Lê CSV, --esperadas, tolerância e --demo
    dos argumentos do processo.
    Retorno: código 0 para captura aprovada e 1 para captura reprovada.
    Funcionamento: executa a demonstração ou lê o CSV, avalia a captura e
    imprime o relatório. Argumentos inválidos geram erro do argparse.
    """
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", nargs="?", type=Path, help="captura com id,sensor_us,motor_us")
    parser.add_argument("--esperadas", type=int, help="número planejado de IDs a partir de zero")
    parser.add_argument("--tolerancia-periodo-us", type=int, default=None)
    parser.add_argument("--demo", action="store_true", help="roda dois casos sintéticos")
    argumentos = parser.parse_args()
    if argumentos.demo:
        return demonstrar()
    if argumentos.csv is None or argumentos.esperadas is None:
        parser.error("informe o CSV e --esperadas, ou use --demo")
    if argumentos.tolerancia_periodo_us is not None and argumentos.tolerancia_periodo_us < 0:
        parser.error("a tolerância de período não pode ser negativa")
    try:
        resultado = avaliar(
            ler_csv(argumentos.csv), argumentos.esperadas, argumentos.tolerancia_periodo_us
        )
    except (OSError, ValueError) as erro:
        parser.error(str(erro))
    mostrar(str(argumentos.csv), resultado)
    return 0 if resultado["aprovado"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
