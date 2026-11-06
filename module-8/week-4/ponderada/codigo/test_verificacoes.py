"""Testes dos verificadores de deadlock e prazo da análise adicional."""

from pathlib import Path
import tempfile
import unittest

import validar_prazo
import verificar_deadlock


class TesteDeadlock(unittest.TestCase):
    """Confere a exploração completa dos locks da A5."""

    def test_original_tem_ciclo(self):
        """Confere o deadlock do modelo original após três aquisições.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: explora os estados e compara totais e caminho mínimo
        com os valores esperados.
        """
        estados, travamentos, completos, exemplo = verificar_deadlock.explorar(
            verificar_deadlock.ORIGINAL
        )
        self.assertEqual((estados, travamentos, completos), (87, 1, 1))
        self.assertEqual(len(exemplo[0]), 3)
        self.assertEqual(len(exemplo[1]), 3)

    def test_ordem_global_remove_ciclo(self):
        """Confere que a ordem global permite o término das três threads.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: explora o modelo corrigido e verifica que ele não
        possui estados de deadlock nem exemplo de travamento.
        """
        estados, travamentos, completos, exemplo = verificar_deadlock.explorar(
            verificar_deadlock.ORDEM_GLOBAL
        )
        self.assertEqual((estados, travamentos, completos), (72, 0, 1))
        self.assertIsNone(exemplo)


class TestePrazo(unittest.TestCase):
    """Confere as regras da captura de sensor e motor."""

    def test_limite_de_cinco_mil_microssegundos(self):
        """Confere a fronteira inclusiva do prazo de 5.000 µs.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: avalia capturas de 5.000 e 5.001 µs e verifica a
        aprovação e a contagem de amostras atrasadas.
        """
        dentro = validar_prazo.avaliar([(0, 0, 5_000)], 1)
        fora = validar_prazo.avaliar([(0, 0, 5_001)], 1)
        self.assertTrue(dentro["aprovado"])
        self.assertFalse(fora["aprovado"])
        self.assertEqual(fora["atrasadas"], 1)

    def test_ausencia_e_duplicacao(self):
        """Confere que uma repetição não encobre a falta de outro ID.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: avalia uma captura com ID duplicado e ausente,
        verificando ambas as contagens e a reprovação.
        """
        linhas = [(0, 0, 4_000), (1, 10_000, 14_000), (1, 10_001, 14_001)]
        resultado = validar_prazo.avaliar(linhas, 3)
        self.assertEqual(resultado["ausentes"], 1)
        self.assertEqual(resultado["duplicadas"], 1)
        self.assertFalse(resultado["aprovado"])

    def test_ordem_e_timestamps_invalidos(self):
        """Confere a rejeição de latência negativa e IDs fora de ordem.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: avalia timestamps e IDs inválidos e verifica as
        contagens de falhas e a reprovação.
        """
        linhas = [(1, 10_000, 9_999), (0, 20_000, 24_000)]
        resultado = validar_prazo.avaliar(linhas, 2)
        self.assertEqual(resultado["invalidas"], 1)
        self.assertEqual(resultado["id_fora_de_ordem"], 1)
        self.assertFalse(resultado["aprovado"])

    def test_tolerancia_de_periodo_opcional(self):
        """Confere a aplicação opcional da tolerância de período.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: avalia o mesmo desvio de 101 µs sem tolerância e com
        limite de 100 µs, conferindo aprovação e reprovação.
        """
        linhas = [(0, 0, 4_000), (1, 10_101, 14_101)]
        self.assertTrue(validar_prazo.avaliar(linhas, 2)["aprovado"])
        self.assertFalse(validar_prazo.avaliar(linhas, 2, 100)["aprovado"])

    def test_csv_e_id_final_ausente(self):
        """Confere a leitura do CSV e a detecção do último ID ausente.

        Parâmetros: self é a instância do teste.
        Retorno: nenhum.
        Funcionamento: cria um CSV temporário com dois IDs, exige três e
        verifica que o ID 2 aparece como ausente.
        """
        with tempfile.TemporaryDirectory() as pasta:
            caminho = Path(pasta) / "captura.csv"
            caminho.write_text(
                "id,sensor_us,motor_us\n0,0,4000\n1,10000,14000\n",
                encoding="utf-8",
            )
            resultado = validar_prazo.avaliar(validar_prazo.ler_csv(caminho), 3)
            self.assertEqual(resultado["exemplos_ausentes"], [2])
            self.assertFalse(resultado["aprovado"])


if __name__ == "__main__":
    unittest.main()
