import pandas as pd


def calculate_demographic_data(print_data=True):
    # Lê o arquivo CSV com os dados do censo
    df = pd.read_csv("adult.data.csv")

    # Quantas pessoas de cada raça estão no dataset?
    race_count = df["race"].value_counts()

    # Qual é a idade média dos homens?
    average_age_men = round(df[df["sex"] == "Male"]["age"].mean(), 1)

    # Qual a porcentagem de pessoas com bacharelado?
    total_pessoas = len(df)
    pessoas_com_bachelors = len(df[df["education"] == "Bachelors"])
    percentage_bachelors = round((pessoas_com_bachelors / total_pessoas) * 100, 1)

    # Identifica quem tem educação avançada
    educacao_avancada = ["Bachelors", "Masters", "Doctorate"]
    higher_education = df[df["education"].isin(educacao_avancada)]
    lower_education = df[~df["education"].isin(educacao_avancada)]

    # Porcentagem com salário >50K para cada grupo de educação
    higher_education_rich = round(
        (
            len(higher_education[higher_education["salary"] == ">50K"])
            / len(higher_education)
        )
        * 100,
        1,
    )
    lower_education_rich = round(
        (
            len(lower_education[lower_education["salary"] == ">50K"])
            / len(lower_education)
        )
        * 100,
        1,
    )

    # Número mínimo de horas trabalhadas por semana
    min_work_hours = df["hours-per-week"].min()

    # Filtra pessoas que trabalham o mínimo de horas
    num_min_workers = df[df["hours-per-week"] == min_work_hours]

    # Porcentagem dos que trabalham mínimo de horas e ganham >50K
    trabalhadores_minimo_ricos = len(
        num_min_workers[num_min_workers["salary"] == ">50K"]
    )
    total_trabalhadores_minimo = len(num_min_workers)
    rich_percentage = round(
        (trabalhadores_minimo_ricos / total_trabalhadores_minimo) * 100, 1
    )

    # País com maior porcentagem de pessoas que ganham >50K
    # Agrupa por país e calcula a porcentagem de ricos em cada um
    paises_stats = df.groupby("native-country").apply(
        lambda x: (x["salary"] == ">50K").sum() / len(x) * 100
    )

    highest_earning_country = paises_stats.idxmax()
    highest_earning_country_percentage = round(paises_stats.max(), 1)

    # Ocupação mais popular para quem ganha >50K na Índia
    india_ricos = df[(df["native-country"] == "India") & (df["salary"] == ">50K")]
    top_IN_occupation = india_ricos["occupation"].value_counts().idxmax()

    # NÃO MODIFIQUE ABAIXO DESTA LINHA

    if print_data:
        print("Número de cada raça:\n", race_count)
        print("Idade média dos homens:", average_age_men)
        print(f"Porcentagem com bacharelado: {percentage_bachelors}%")
        print(
            f"Porcentagem com educação avançada que ganham >50K: {higher_education_rich}%"
        )
        print(
            f"Porcentagem sem educação avançada que ganham >50K: {lower_education_rich}%"
        )
        print(f"Tempo mínimo de trabalho: {min_work_hours} horas/semana")
        print(
            f"Porcentagem de ricos entre os que trabalham menos horas: {rich_percentage}%"
        )
        print("País com maior porcentagem de ricos:", highest_earning_country)
        print(
            f"Maior porcentagem de pessoas ricas no país: {highest_earning_country_percentage}%"
        )
        print("Principais ocupações na Índia:", top_IN_occupation)

    return {
        "race_count": race_count,
        "average_age_men": average_age_men,
        "percentage_bachelors": percentage_bachelors,
        "higher_education_rich": higher_education_rich,
        "lower_education_rich": lower_education_rich,
        "min_work_hours": min_work_hours,
        "rich_percentage": rich_percentage,
        "highest_earning_country": highest_earning_country,
        "highest_earning_country_percentage": highest_earning_country_percentage,
        "top_IN_occupation": top_IN_occupation,
    }
