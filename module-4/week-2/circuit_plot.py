import matplotlib.pyplot as plt
import numpy as np


# Ler dados do arquivo serial_monitor.txt
def ler_dados(arquivo="serial_monitor.txt"):
    tempo = []
    tensao_resistor = []
    tensao_capacitor = []

    with open(arquivo, "r") as f:
        for linha in f:
            try:
                valores = linha.strip().split()
                if len(valores) == 3:
                    tempo.append(float(valores[0]) / 1000)  # ms para segundos
                    tensao_resistor.append(float(valores[1]))
                    tensao_capacitor.append(float(valores[2]))
            except ValueError:
                continue

    return np.array(tempo), np.array(tensao_resistor), np.array(tensao_capacitor)


# Ler dados
tempo, tensao_resistor, tensao_capacitor = ler_dados()

print(f"Dados lidos: {len(tempo)} pontos")

# ===========================================
# GRÁFICO 1: Carga no Capacitor
# ===========================================
plt.figure(figsize=(10, 6))
plt.plot(tempo, tensao_capacitor, "b-", linewidth=2)
plt.xlabel("Tempo (s)", fontsize=12)
plt.ylabel("Tensão (V)", fontsize=12)
plt.title("Carga do Capacitor", fontsize=14, fontweight="bold")
plt.grid(True, alpha=0.3)
plt.ylim(0, 5.5)
plt.savefig("graficos/carga_capacitor.png", dpi=300, bbox_inches="tight")
print("✓ Gráfico 1: carga_capacitor.png")

# ===========================================
# GRÁFICO 2: Descarga no Resistor
# ===========================================
plt.figure(figsize=(10, 6))
plt.plot(tempo, tensao_resistor, "r-", linewidth=2)
plt.xlabel("Tempo (s)", fontsize=12)
plt.ylabel("Tensão (V)", fontsize=12)
plt.title("Tensão no Resistor", fontsize=14, fontweight="bold")
plt.grid(True, alpha=0.3)
plt.ylim(0, 5.5)
plt.savefig("graficos/tensao_resistor.png", dpi=300, bbox_inches="tight")
print("✓ Gráfico 2: tensao_resistor.png")

# ===========================================
# GRÁFICO 3: Comparação (Carga C x Descarga R)
# ===========================================
plt.figure(figsize=(12, 6))
plt.plot(tempo, tensao_capacitor, "b-", linewidth=2.5, label="Capacitor", alpha=0.8)
plt.plot(tempo, tensao_resistor, "r-", linewidth=2.5, label="Resistor", alpha=0.8)
plt.xlabel("Tempo (s)", fontsize=12)
plt.ylabel("Tensão (V)", fontsize=12)
plt.title("Comparação: Capacitor x Resistor", fontsize=14, fontweight="bold")
plt.grid(True, alpha=0.3)
plt.legend(fontsize=11)
plt.ylim(0, 5.5)
plt.savefig("graficos/comparacao.png", dpi=300, bbox_inches="tight")
print("✓ Gráfico 3: comparacao.png")

print("\n✓ Todos os gráficos gerados!")
