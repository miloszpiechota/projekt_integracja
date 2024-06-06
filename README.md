
https://github.com/miloszpiechota/projekt_integracja/assets/161620373/b3220b93-16fb-41b0-87eb-6b3dc10d89b3
# Wstęp



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
5. Uruchom aplikację servera i klienta poleceniem "npm start"

# Autoryzacja tokenem
# Rejestracja użytkownika

https://github.com/miloszpiechota/projekt_integracja/assets/161620373/abe179ca-321c-4713-8489-1c06e8f8b95f



# Logowanie użytkownika


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/15b66526-d079-478c-866b-d85c39634bf3


# Generowanie wykresów



https://github.com/miloszpiechota/projekt_integracja/assets/161620373/030beae5-0302-428f-a54c-9de8ce5e206d


# Wyszukiwanie danych


# Konwersja danych

## Konwersja XML -> JSON


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/61d8cb33-6574-4f49-85b8-5dfd4d13e082


## Konwersja XML -> YAML


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/a48c4575-f0d2-4277-af6f-ce11198a93a8


## Konwersja CSV -> JSON


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/fb9c9918-faef-43af-b5a9-c7ac7be367e0


## Konwersja XML -> CSV


https://github.com/miloszpiechota/projekt_integracja/assets/161620373/faf881dc-cbf5-48dc-9fc3-5622ba3d91f3

# Export danych z bazy danych


# Import danych z bazy danych



https://github.com/miloszpiechota/projekt_integracja/assets/161620373/993c404a-5d4a-45fe-a112-f7976ad42b91


# Wyświetlenie użytkowników


# Usunuęcie konta użytkownika



https://github.com/miloszpiechota/projekt_integracja/assets/161620373/1d54c097-7e6d-465f-a3e3-eb2776de45d8



# Wylogowanie użytkownika


