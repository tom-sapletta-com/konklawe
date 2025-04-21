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

## Autorzy
- Projekt graficzny: Tom Sapletta
- Programowanie: Tom Sapletta
- Koncepcja i zasady gry: Tom Sapletta

## Licencja

[LCIENSE](LICENSE)