import unittest
import demographic_data_analyzer


class DemographicAnalyzerTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.data = demographic_data_analyzer.calculate_demographic_data(
            print_data=False
        )

    def test_race_count(self):
        actual = self.data["race_count"].tolist()
        expected = [27816, 3124, 1039, 311, 271]
        self.assertCountEqual(
            actual,
            expected,
            msg="Esperado que a contagem de raças seja [27816, 3124, 1039, 311, 271]",
        )

    def test_average_age_men(self):
        actual = self.data["average_age_men"]
        expected = 39.4
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para idade média dos homens.",
        )

    def test_percentage_bachelors(self):
        actual = self.data["percentage_bachelors"]
        expected = 16.4
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para porcentagem com bacharelado.",
        )

    def test_higher_education_rich(self):
        actual = self.data["higher_education_rich"]
        expected = 46.5
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para porcentagem com educação avançada que ganham >50K.",
        )

    def test_lower_education_rich(self):
        actual = self.data["lower_education_rich"]
        expected = 17.4
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para porcentagem sem educação avançada que ganham >50K.",
        )

    def test_min_work_hours(self):
        actual = self.data["min_work_hours"]
        expected = 1
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para mínimo de horas trabalhadas.",
        )

    def test_rich_percentage(self):
        actual = self.data["rich_percentage"]
        expected = 10
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para porcentagem de ricos entre os que trabalham menos horas.",
        )

    def test_highest_earning_country(self):
        actual = self.data["highest_earning_country"]
        expected = "Iran"
        self.assertEqual(
            actual,
            expected,
            "Esperado valor diferente para país com maior porcentagem de ricos.",
        )

    def test_highest_earning_country_percentage(self):
        actual = self.data["highest_earning_country_percentage"]
        expected = 41.9
        self.assertAlmostEqual(
            actual,
            expected,
            msg="Esperado valor diferente para porcentagem do país com mais ricos.",
        )

    def test_top_IN_occupation(self):
        actual = self.data["top_IN_occupation"]
        expected = "Prof-specialty"
        self.assertEqual(
            actual,
            expected,
            "Esperado valor diferente para principal ocupação na Índia.",
        )


if __name__ == "__main__":
    unittest.main()