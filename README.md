# Gra "Konklawe"

"Konklawe" to przeglądarkowa gra strategiczna dla 2 graczy, symulująca proces wyboru papieża. Gracze rywalizują o wpływ na wybór kardynałów poprzez zagrywanie kart wpływów (politycznych, demonicznych, duchowych i medialnych) oraz kart kardynałów.

## Zawartość repozytorium

- `index.html` - główna struktura HTML gry
- `styles.css` - arkusz stylów CSS dla interfejsu gry
- `data.js` - dane kart kardynałów i kart wpływów
- `game.js` - główna logika gry (mechaniki, renderowanie interfejsu, obsługa zdarzeń)
- `cards.json` - alternatywny format danych kart w formacie JSON
- `gameUtils.js` - pomocnicze funkcje narzędziowe

## Zasady gry

### Przygotowanie
1. Na początku na planszy jest 5 zakrytych kart kardynałów.
2. Każdy gracz otrzymuje do ręki 3 losowe karty.

### Przebieg rozgrywki
1. Gra toczy się przez 5 rund (lub do momentu wyłonienia papieża).
2. W swojej turze gracz:
   - Dobiera kartę
   - Zagrywa kartę z ręki
   - Kończy turę

3. Po zagraniu karty odkrywana jest losowa karta kardynała na planszy.
4. Karty wpływów modyfikują szanse kardynałów na wybór.

### Typy kart wpływów
- **Polityczne** (niebieskie) - reprezentują wpływy polityczne, w tym wpływ prezydenta Trumpa
- **Demoniczne** (czerwone) - reprezentują negatywne wpływy, pokusy i manipulacje
- **Duchowe** (błękitne) - reprezentują pozytywne wpływy duchowe i ochronę
- **Medialne** (zielone) - reprezentują wpływ opinii publicznej i mediów

### Głosowanie
- Na końcu 5 rundy (lub wcześniej na żądanie) odbywa się głosowanie.
- Kardynał z co najmniej 2/3 głosów zostaje wybrany na papieża.
- Jeśli żaden kardynał nie uzyska wymaganej większości, wygrywa ten z najwyższym poparciem.

## Jak uruchomić grę
1. Pobierz wszystkie pliki do jednego katalogu.
2. Otwórz plik `index.html` w nowoczesnej przeglądarce (Chrome, Firefox, Edge).
3. Alternatywnie, możesz uruchomić lokalny serwer HTTP, np. za pomocą:
   ```
   python -m http.server
   ```
   a następnie otworzyć `http://localhost:8000` w przeglądarce.

## Funkcje do rozszerzenia/rozwoju
- Implementacja trybu gry jednoosobowej (przeciwko AI)
- Dodanie większej liczby kart wpływów i kardynałów
- Dodanie efektów dźwiękowych i animacji
- Zapisywanie stanu gry w localStorage
- Tryb gry online z użyciem WebSockets


# Struktura projektu gry "Konklawe"

## Pliki projektu

```
konklawe/
│
├── index.html              # Główny plik HTML z interfejsem gry
├── styles.css              # Arkusz stylów
│
├── js/
│   ├── main.js             # Główny plik inicjujący aplikację
│   ├── data.js             # Dane kart (kardynałów i wpływów)
│   ├── gameState.js        # Zarządzanie stanem gry
│   ├── gameLogic.js        # Główna logika gry
│   ├── cardEffects.js      # Efekty kart wpływów
│   ├── gameUI.js           # Obsługa interfejsu użytkownika
│   └── gameUtils.js        # Funkcje pomocnicze
│
└── data/
    └── cards.json          # Dane kart w formacie JSON (alternatywnie)
```

## Architektura modułowa

### 1. Moduł Stanu Gry (`gameState.js`)

Ten moduł zarządza całym stanem gry i udostępnia API do jego modyfikacji. Zapewnia:
- Inicjalny stan gry
- Funkcje do resetowania stanu
- Gettery i settery dla różnych elementów stanu
- Atomowe funkcje do aktualizacji różnych części stanu

### 2. Moduł Logiki Gry (`gameLogic.js`)

Zawiera główne mechaniki gry:
- Inicjalizacja gry
- Dobieranie kart
- Umieszczanie kart na planszy
- Zagrywanie kart
- Zakończenie tury
- System głosowania

### 3. Moduł Efektów Kart (`cardEffects.js`)

Odpowiada za aplikowanie efektów kart wpływów:
- Implementacja efektów dla różnych typów kart
- Modyfikowanie szans kardynałów
- Aplikowanie specjalnych efektów

### 4. Moduł Interfejsu Użytkownika (`gameUI.js`)

Obsługuje interakcję z interfejsem graficznym:
- Renderowanie kart na planszy
- Renderowanie kart w rękach graczy
- Aktualizacja całego interfejsu
- Obsługa zdarzeń (kliknięcia, itp.)
- Zarządzanie modalnymi oknami
- System logowania zdarzeń

### 5. Moduł Danych (`data.js`)

Zawiera stałe dane dla gry:
- Definicje kart kardynałów
- Definicje kart wpływów

### 6. Moduł Narzędzi (`gameUtils.js`)

Zawiera funkcje pomocnicze używane w innych modułach:
- Ładowanie danych z JSON
- Obliczanie wyników głosowania
- Aplikowanie efektów do kardynałów
- Funkcje pomocnicze (losowanie, kopiowanie obiektów, itp.)

### 7. Moduł Główny (`main.js`)

Inicjuje aplikację:
- Importuje niezbędne moduły
- Inicjalizuje nasłuchiwacze zdarzeń
- Rozpoczyna grę

## Przepływ danych

1. Użytkownik podejmuje akcję (np. kliknięcie przycisku)
2. Event listener w `gameUI.js` przechwytuje zdarzenie
3. Wywołana zostaje odpowiednia funkcja z `gameLogic.js`
4. Funkcja logiki modyfikuje stan gry poprzez API z `gameState.js`
5. W razie potrzeby aplikowane są efekty kart z `cardEffects.js`
6. Po zakończeniu akcji, wywoływana jest funkcja `updateUI()` z `gameUI.js`
7. Interfejs jest aktualizowany na podstawie aktualnego stanu gry

## Główne mechaniki gry

1. **System tur i rund**:
   - Gra toczy się przez określoną liczbę rund
   - Każda runda składa się z tury gracza 1 i gracza 2
   - Każda tura zawiera fazy: dobierania, zagrywania i kończenia

2. **System wpływów**:
   - Karty wpływów modyfikują szanse kardynałów
   - Każda karta ma określony czas trwania (liczba rund)
   - Wpływy mogą się neutralizować nawzajem

3. **System głosowania**:
   - Na końcu ostatniej rundy odbywa się automatyczne głosowanie
   - Kardynał z co najmniej 2/3 głosów zostaje papieżem
   - Jeśli żaden nie ma wystarczającej większości, wygrywa kardynał z największą liczbą głosów

## Rozszerzalność

Architektura jest zaprojektowana pod kątem łatwej rozszerzalności:
- Dodawanie nowych kart wymaga tylko uzupełnienia danych w `data.js` lub `cards.json`
- Implementacja nowych efektów kart wymaga dodania nowych przypadków w `cardEffects.js`
- Modyfikacje zasad gry mogą być wprowadzane w `gameLogic.js` bez wpływu na inne komponenty
- Interface można rozbudowywać w `gameUI.js` bez zmiany logiki gry



## Autorzy
- Projekt graficzny: Tom Sapletta
- Programowanie: Tom Sapletta
- Koncepcja i zasady gry: Tom Sapletta

## Licencja

[LCIENSE](LICENSE)