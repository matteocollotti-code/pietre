import pandas as pd

# Load the excel file
df = pd.read_excel('pietre.xlsx')

# Print columns and first 5 rows
print("Columns:", df.columns.tolist())
print("\nFirst 5 rows:")
print(df.head())
