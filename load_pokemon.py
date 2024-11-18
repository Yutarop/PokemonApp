import pandas as pd
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_csv('pokemon.csv') 
data = df[["pokedex_number", "name", "Katakana"]].to_dict(orient='records')

print(json.dumps(data, ensure_ascii=False))
