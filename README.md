# Sprawozdanie - Projekt Integracja Systemów 
# Temat - Zestawienie danych dotyczących rozwoju przemysłu i stanu środowiska naturalnego

# Miłosz Piechota IO 6.7, Grzegorz Rogowski IO 6.7

# Spis Treści

1. [Wprowadzenie](#wprowadzenie)
2. [Konfiguracja środowiska](#konfiguracja-środowiska)
3. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
4. [Autoryzacja tokenem](#autoryzacja-tokenem)
5. [Rejestracja użytkownika](#rejestracja-użytkownika)
6. [Logowanie użytkownika](#logowanie-użytkownika)
7. [Generowanie wykresów](#generowanie-wykresów)
8. [Wnioski na podstawie wykresów](#wnioski-na-podstawie-wykresów)
9. [Wyszukiwanie danych z CO2-emmissions.csv](#wyszukiwanie-danych-z-co2-emmissionscsv)
10. [Konwersja danych](#konwersja-danych)
11. [Import i Export danych z bazy danych](#import-i-export-danych-z-bazy-danych)
12. [Wyświetlenie użytkowników lub usunięcie konta użytkownika](#wyświetlenie-użytkowników-lub-usunięcie-konta-użytkownika)
13. [Wylogowanie użytkownika](#wylogowanie-użytkownika)
14. [Wnioski na podstawie całego projektu](#wnioski-na-podstawie-całego-projektu)

    

# Wstęp

Na podstawie danych związanych z poziomem rozwoju gospodarki kraju i współczynnika zalesienia stworzyliśmy aplikację w technologii MERN stack (client-server) i Python umożliwiającą założenie własnego konta oraz analizę danych 1960-2023 pobranych z datasets [forest_area.xml](https://data.worldbank.org/indicator/AG.LND.FRST.ZS ), [industrial_development.csv](https://data.worldbank.org/indicator/NV.IND.TOTL.ZS ), [CO2_emissions.csv](https://data.worldbank.org/indicator/EN.ATM.CO2E.PC ) na podstawie czego użytkownik ma możliwość wyszukiwać dane konkretnego kraju z pliku co2_emissions.xml (kraj, kod kraju), konwertować dane, exportować i importować dane do bazy MongoDB Atlas oraz modyfikując plik generate_charts.py generować wykresy zależności pomiędzy danymi ograniczając się do konkretnych państw. Dodatkowe funkcjie to usunięcie konta użytkownika lub wyświetlenie wszytskich użytkowników.




# Konfiguracja środowiska
# Uruchomienie aplikacji
Aby uruchomić aplikację należy:
1. Pobrać wszystkie wymagane biblioteki po stronie klienta i serwera za pomocą polecenia `npm install`

client@0.1.0 
├── @testing-library/jest-dom@5.17.0
├── @testing-library/react@13.4.0
├── @testing-library/user-event@13.5.0
├── axios@1.6.8
├── csvtojson@2.0.10
├── fs@0.0.1-security
├── js-yaml@4.1.0
├── matplotlib@1.0.0
├── pandas@0.0.3
├── path@0.12.7
├── react-dom@18.3.1
├── react-router-dom@6.23.1
├── react-scripts@5.0.1
├── react@18.3.1
└── web-vitals@2.1.4

server@1.0.0 
├── bcrypt@5.1.1
├── cors@2.8.5
├── csvtojson@2.0.10
├── dotenv@16.4.5
├── express@4.19.2
├── fs@0.0.1-security
├── joi-password-complexity@5.2.0
├── joi-password@4.2.0
├── joi@17.13.1
├── js-yaml@4.1.0
├── jsonwebtoken@9.0.2
├── matplotlib@1.0.0
├── mongoose@8.4.0
├── nodemon@3.1.0
├── pandas@0.0.
├── path@0.12.7
└── xml2js@0.6.2

3. Stworzyć plik .env w katalogu serwera z konfiguracją bazy danych.

```
# dodaj ciąg bazy danych
DB=mongodb+srv://<user_name>:<password>@cluster0.p0xww3d.mongodb.net/?retryWrites=true&w=majority&appName=<cluster>
# ustaw port
PORT=8080
# klucz prywatny używany do podpisywania tokenów JWT
JWTPRIVATEKEY=abcdefg
#generowanie soli podczas hashowania haseł 
SALT=10
```

4. Upewnić się, że client i server działają na tym samym porcie
5. Uruchom aplikację servera i klienta poleceniem "npm start" w oddzielnych terminalach

# Autoryzacja tokenem


# Rejestracja użytkownika

- Użycie Joi do walidacji danych wejściowych zapewnia, że użytkownik podaje prawidłowy adres e-mail i hasło,
- Sprawdzenie, czy użytkownik istnieje w bazie danych, zanim przejdziesz dalej,
- Użycie bcrypt do porównywania hasła użytkownika z hasłem zapisanym w bazie danych zapewnia bezpieczeństwo hasła,
- Generowanie tokenu autoryzacyjnego dla zalogowanego użytkownika 

https://github.com/miloszpiechota/projekt_integracja/assets/161620373/abe179ca-321c-4713-8489-1c06e8f8b95f


# Logowanie użytkownika

- Metoda generateAuthToken wykorzystuje jsonwebtoken do generowania tokenu JWT z czasem wygaśnięcia 7 dni
  
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/15b66526-d079-478c-866b-d85c39634bf3


# Generowanie wykresów
- w pliku generate_charts.py tworzone są tzry wykresy: "współczynnik zalesienia danego kraju/krajów na przestzreni lat", "współczynnik rozwoju gospodarki danego kraju/krajów na przestzreni lat", " wykres zależności współczynnika rozwoju gospodarki do współczynnika zalesienia danego kraju na przestzreni lat"
- poprzez modyfikację tablic "selected_countries = ["France"]" w pliku generate_charts.py poprzez dodanie krajów możliwa jest modyfikacja wykresów
- obrazki wykresów są aktualizowane na bieżąco po wygenerowaniu wykresów dzięki przesłaniu ich do klienta przez serwer po zakończeniu generowania wykresów
- Po wygenerowaniu wykresów, skrypt zapisuje je jako pliki obrazów  w  folderze na serwerze
- generowanie wykresów poprzez uruchomienie skryptu Pythona za pomocą Node.js
- Wywołanie skryptu Pythona odbywa się poprzez funkcję spawn z modułu child_process, która uruchamia skrypt Pythona w oddzielnym procesie
- Gdy proces Pythona zakończy się, serwer wysyła wygenerowany wykres z powrotem do klienta
- Jeśli wystąpi błąd podczas generowania wykresu, serwer zwraca kod statusu 500 i komunikat "Error generating chart"
- skrypt "generate_charts.py" wczytuje dane z plików XML, przetwarza je i tworzy wykresy za pomocą biblioteki matplotlib
- Wykresy są zapisywane jako pliki obrazów, które są przesyłane z powrotem do serwera

https://github.com/miloszpiechota/projekt_integracja/assets/161620373/030beae5-0302-428f-a54c-9de8ce5e206d

Przykładowa analiza wykresu zależności współczynnika rozwoju gospodarki do współczynnika zalesienia danego kraju:
![image](https://github.com/miloszpiechota/projekt_integracja/assets/161620373/5dc34ea8-76d9-4296-8c46-a12b5993510b)

# Wnioski na podstawie wykresów
Na podstawie tego wykresu widać, że dane pobrane z datasets forest_area.xml nie są kompletne na przestrzeni lat 1960-1990 czego przyczyną są wartości null współczynnika zalesienia danego kraju co skutkuje brakiem linii na wykresie w tych latach. Dodatkowo porównując współczynnik udziału przemysłu w PKB do współczynnika zalesienia możemy wywnioskować, że w przypadku Francji wraz ze spadkiem procentu przemysłu w PKB wzrasta zalesienie tego państwa.



# Wyszukiwanie danych z CO2-emmissions.csv
- Dane są wyszukiwane tylko dla wartości not null
- Ścieżka do pliku CSV z danymi jest ustawiona przy użyciu path.join.
- Entity i code są pobierane z parametrów zapytania (req.query).
- Plik CSV jest konwertowany do formatu JSON przy użyciu biblioteki csvtojson.
- csvtojson().fromFile(csvFilePath) odczytuje plik CSV i konwertuje jego zawartość na tablicę obiektów JSON.
- Dane są filtrowane na podstawie wartości entity lub code.
- Porównania są dokonywane w sposób nieczuły na wielkość liter (toLowerCase)
- Dodatkowy filtr usuwa rekordy, które nie mają wartości emisji CO2 lub mają wartość mniejszą lub równą 0

  
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/178d9e28-4a59-4709-bc6f-32a32cdc7688



# Konwersja danych

  
## Konwersja XML -> JSON

- xmlFilePath określa ścieżkę do pliku XML (forest_area.xml), który ma być konwertowany
- jsonFilePath określa, gdzie zapisany zostanie wynikowy plik JSON (forest_area.json)
- fs.readFile jest używane do odczytu pliku XML w formacie UTF-8
- xml2js.parseString konwertuje odczytane dane XML na JSON
- explicitArray: false w opcjach konwersji sprawia, że pojedyncze elementy nie są umieszczane w tablicy
- fs.writeFile zapisuje skonwertowane dane JSON do pliku na określonej ścieżce
- Dane JSON są sformatowane za pomocą JSON.stringify(jsonData, null, 2) dla lepszej czytelności
- Po pomyślnej konwersji i zapisaniu pliku JSON, endpoint zwraca odpowiedź z komunikatem o sukcesie i ścieżką do pliku JSON

  
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/61d8cb33-6574-4f49-85b8-5dfd4d13e082


## Konwersja XML -> YAML

-  fs.readFile odczytuje zawartość pliku XML w formacie UTF-8
-  xml2js.parseString konwertuje XML na JSON, z opcją explicitArray: false
-  yaml.dump konwertuje JSON na YAML
-  fs.writeFile zapisuje skonwertowane dane YAML do pliku

https://github.com/miloszpiechota/projekt_integracja/assets/161620373/a48c4575-f0d2-4277-af6f-ce11198a93a8


## Konwersja CSV -> JSON


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/fb9c9918-faef-43af-b5a9-c7ac7be367e0


## Konwersja XML -> CSV

- Ścieżki do pliku XML (xmlFilePath) oraz wynikowego pliku CSV (csvFilePath) są zdefiniowane przy użyciu path.join
- fs.readFile odczytuje zawartość pliku XML w formacie UTF-8
- xml2js.parseString konwertuje dane XML na format JSON
- Zakłada się, że struktura JSON ma format, w którym dane są zawarte w jsonData.Root.data.record
- record to tablica, a każdy rekord ma pole field, które zawiera atrybuty o nazwach i wartościach
- Przekształcamy każdy rekord na obiekt JavaScript, gdzie klucze to nazwy pól, a wartości to wartości tych pól
- csvHeaders zawiera nagłówki CSV, utworzone z kluczy pierwszego rekordu
- csvData zawiera wartości rekordu, połączone przecinkami, dla każdego rekordu
- csvContent to pełna zawartość CSV, z nagłówkami i danymi, oddzielonymi nowymi liniami
- 
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/faf881dc-cbf5-48dc-9fc3-5622ba3d91f3



# Import i Export danych z bazy danych

- Funkcja importData() importuje dane z plików XML forest_area.xml i industrial_development.xml oraz zapisuje je do odpowiednich kolekcji w bazie danych (forestareas i industrialdevelopments)
- W przypadku sukcesu, zwracana jest odpowiedź z kodem statusu 200 i komunikatem "Data exported successfully"
- Za pomocą metod find({}).limit(100) pobiera 100 dokumentów z każdej z tych kolekcji.
- Metoda find({}) bez argumentów zwraca wszystkie dokumenty w kolekcji, a limit(100) ogranicza wyniki do 100 dokumentów

  
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/993c404a-5d4a-45fe-a112-f7976ad42b91


# Wyświetlenie użytkowników lub usunięcie konta użytkownika
- Pobiera szczegóły użytkownika na podstawie jego ID, które jest dostarczone w żądaniu (req.user._id)
- Używamy metody findById do znalezienia użytkownika w bazie danych na podstawie jego ID
- Usuwa konto użytkownika na podstawie jego ID, które jest dostarczone w żądaniu (req.user._id)

https://github.com/miloszpiechota/projekt_integracja/assets/161620373/1d54c097-7e6d-465f-a3e3-eb2776de45d8



# Wylogowanie użytkownika

- localStorage.removeItem('token') usuwa token uwierzytelniający z localStorage przeglądarki,
- Token uwierzytelniający jest przechowywany w localStorage, aby aplikacja mogła go użyć do autoryzacji żądań HTTP
- Dzięki temu, że token został usunięty, użytkownik zostanie automatycznie wylogowany z aplikacji.

# Wnioski na podstawie całego projektu

Projekt wykorzystuje różnorodne technologie, takie jak MERN stack (MongoDB, Express.js, React.js, Node.js) oraz Python, aby stworzyć kompleksową aplikację umożliwiającą analizę danych.

Dzięki aplikacji użytkownicy mogą analizować dane dotyczące rozwoju przemysłu i środowiska naturalnego z lat 1960-2023, co pozwala na lepsze zrozumienie trendów i zależności między tymi dwoma obszarami
Poniżej znajduje się dokładny opis funkcjonalności naszej aplikacji.

Implementacja funkcji rejestracji, logowania i autoryzacji tokenem JWT zapewnia bezpieczny dostęp do aplikacji oraz ochronę danych użytkowników.

Automatyczne generowanie wykresów na podstawie danych z plików XML za pomocą skryptu Pythona, a następnie przesyłanie ich do klienta, umożliwia użytkownikom wizualizację danych i lepsze zrozumienie analizowanych informacji.

Aplikacja umożliwia konwersję danych między różnymi formatami, takimi jak XML, JSON, CSV i YAML, co zwiększa elastyczność w manipulacji danymi.

Funkcje importu i eksportu danych do i z bazy danych MongoDB Atlas ułatwiają zarządzanie i udostępnianie danych.

Tworząc ten projekt, zdobyliśmy cenne doświadczenie w integracji różnorodnych technologii, takich jak MERN stack i Python. Dzięki temu udało nam się skutecznie analizować dane pobrane z różnych źródeł, umożliwiając głębszą analizę korelacji między nimi. Ta  praca pozwoliła nam lepiej zrozumieć złożone zależności między rozwojem przemysłu a stanem środowiska naturalnego.
