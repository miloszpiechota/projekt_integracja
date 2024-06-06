import xml.etree.ElementTree as ET
import pandas as pd
import matplotlib.pyplot as plt
import os

# Function to load data from XML
def load_data_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    data = []
    for record in root.findall('.//record'):
        country = record.find(".//field[@name='Country or Area']").text
        item = record.find(".//field[@name='Item']").text
        year = record.find(".//field[@name='Year']").text
        value = record.find(".//field[@name='Value']").text
        value = float(value) if value else None
        data.append((country, item, int(year), value))
    return data

# Ścieżki do plików XML
industrial_file = 'C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\server\\datasets\\industrial_development.xml'
forest_file = 'C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\server\\datasets\\forest_area.xml'

# Wczytanie danych
industrial_data = load_data_from_xml(industrial_file)
forest_data = load_data_from_xml(forest_file)

# Konwersja do DataFrame
industrial_df = pd.DataFrame(industrial_data, columns=['Country', 'Item', 'Year', 'Value'])
forest_df = pd.DataFrame(forest_data, columns=['Country', 'Item', 'Year', 'Value'])

# Filtracja danych tylko dla wybranych krajów
selected_countries = ["Poland"]
industrial_df = industrial_df[industrial_df['Country'].isin(selected_countries)]
forest_df = forest_df[forest_df['Country'].isin(selected_countries)]

# Filtrowanie danych dla odpowiednich przedmiotów
industrial_df = industrial_df[industrial_df['Item'] == 'Industry (including construction), value added (% of GDP)']
forest_df = forest_df[forest_df['Item'] == 'Forest area (% of land area)']

# Zmiana nazw kolumn dla wygody
industrial_df = industrial_df.rename(columns={'Value': 'Industry (% of GDP)'})
forest_df = forest_df.rename(columns={'Value': 'Forest (% of land area)'})

# Połączenie danych na podstawie roku i kraju
merged_df = pd.merge(industrial_df, forest_df, on=['Country', 'Year'])

# Wykreślenie danych
plt.figure(figsize=(12, 6))

for country in selected_countries:
    country_data = merged_df[merged_df['Country'] == country]
    plt.plot(country_data['Year'], country_data['Industry (% of GDP)'], label=f'{country} - Industry')
    plt.plot(country_data['Year'], country_data['Forest (% of land area)'], label=f'{country} - Forest')

plt.xlabel('Year')
plt.ylabel('Percentage')
plt.title('Industry vs Forest Area (1960-2023)')
plt.legend()
plt.savefig('C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\client\\public\\Industry_vs_Forest_Poland.png')
plt.show()


# Function to load data from XML
def load_data_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    data = []
    for record in root.findall('.//record'):
        country = record.find(".//field[@name='Country or Area']").text
        item = record.find(".//field[@name='Item']").text
        year = record.find(".//field[@name='Year']").text
        value = record.find(".//field[@name='Value']").text
        value = float(value) if value else None
        data.append((country, item, int(year), value))
    return data

# File path to the XML file
file_path = 'C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\server\\datasets\\industrial_development.xml'
# Load data from XML
data = load_data_from_xml(file_path)

# Convert data to DataFrame
df = pd.DataFrame(data, columns=['Country', 'Item', 'Year', 'Value'])

# Filter data for the specific item "Industry (including construction), value added (% of GDP)"
df = df[df['Item'] == 'Industry (including construction), value added (% of GDP)']

# Remove rows with missing values
df = df.dropna(subset=['Value'])

# Select specific countries
selected_countries = ["Aruba", "Germany", "France"]  # Change the list to your selected countries
df = df[df['Country'].isin(selected_countries)]

# Plot the data for selected countries
plt.figure(figsize=(12, 6))

for country in selected_countries:
    country_data = df[df['Country'] == country]
    plt.plot(country_data['Year'], country_data['Value'], marker='o', linestyle='-', label=country)

plt.xlabel('Year')
plt.ylabel('Industry (including construction), value added (% of GDP)')
plt.title('Industry (including construction), value added (% of GDP) Over Years for Selected Countries')
plt.legend()
plt.grid(True)
plt.savefig('C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\client\public\\Industry_value_added_selected_countries.png')
plt.show()

def load_data_from_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    data = []
    for record in root.findall('.//record'):
        country = record.find(".//field[@name='Country or Area']").text
        item = record.find(".//field[@name='Item']").text
        year = record.find(".//field[@name='Year']").text
        value = record.find(".//field[@name='Value']").text
        value = float(value) if value else None
        data.append((country, item, int(year), value))
    return data

# File path to the XML file
file_path = 'C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\server\\datasets\\forest_area.xml'
# Load data from XML
data = load_data_from_xml(file_path)

# Convert data to DataFrame
df = pd.DataFrame(data, columns=['Country', 'Item', 'Year', 'Value'])

# Filter data for the specific item "Forest area (% of land area)"
df = df[df['Item'] == 'Forest area (% of land area)']

# Remove rows with missing values
df = df.dropna(subset=['Value'])

# Select specific countries
selected_countries = [ "France","USA","Germany"]  # Change the list to your selected countries
df = df[df['Country'].isin(selected_countries)]

# Plot the data for selected countries
plt.figure(figsize=(12, 6))

for country in selected_countries:
    country_data = df[df['Country'] == country]
    plt.plot(country_data['Year'], country_data['Value'], marker='o', linestyle='-', label=country)

plt.xlabel('Year')
plt.ylabel('Forest area (% of land area)')
plt.title('Forest area (% of land area) Over Years for Selected Countries')
plt.legend()
plt.grid(True)
plt.savefig('C:\\Users\\Milosz\\Desktop\\Semestr 6\\Szkielety programistyczne\\Lab7_MERNn\\client\\public\\Forest_area_selected_countries.png')
plt.show()
