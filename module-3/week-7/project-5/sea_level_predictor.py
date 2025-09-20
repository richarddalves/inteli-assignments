import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress


def draw_plot():
    # Read data from file
    df = pd.read_csv("epa-sea-level.csv")

    # Create scatter plot
    plt.figure(figsize=(12, 6))
    plt.scatter(df["Year"], df["CSIRO Adjusted Sea Level"], alpha=0.5)

    # Create first line of best fit
    res = linregress(df["Year"], df["CSIRO Adjusted Sea Level"])

    years_extended = pd.Series(range(1880, 2051))
    line1 = res.slope * years_extended + res.intercept
    plt.plot(years_extended, line1, "r", label="Fit: all data")

    # Create second line of best fit
    df_2000 = df[df["Year"] >= 2000]
    res2 = linregress(df_2000["Year"], df_2000["CSIRO Adjusted Sea Level"])

    years_2000 = pd.Series(range(2000, 2051))
    line2 = res2.slope * years_2000 + res2.intercept
    plt.plot(years_2000, line2, "g", label="Fit: 2000-present")

    # Add labels and title
    plt.xlabel("Year")
    plt.ylabel("Sea Level (inches)")
    plt.title("Rise in Sea Level")

    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig("sea_level_plot.png")
    return plt.gca()