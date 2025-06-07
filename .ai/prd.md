# Dokument wymagań produktu (PRD) - FlashcardAI

## 1. Przegląd produktu

FlashcardAI to aplikacja webowa pomagająca dorosłym osobom uczącym się języka angielskiego na poziomie B2/C1 w tworzeniu i nauce fiszek. Aplikacja wykorzystuje sztuczną inteligencję (OpenAI 4o) do automatycznego generowania fiszek na podstawie wprowadzonego tekstu, rozwiązując problem czasochłonności manualnego tworzenia wysokiej jakości fiszek edukacyjnych.

Główne funkcjonalności aplikacji:
- Generowanie fiszek przez AI na podstawie wprowadzonego tekstu
- Manualne tworzenie fiszek
- Przeglądanie, edycja i usuwanie fiszek
- Quiz z losowo wybieranymi fiszkami (pytanie + 4 warianty odpowiedzi)
- Prosty system kont użytkowników

Stos technologiczny:
- Frontend: Astro 5 z React 19 dla komponentów interaktywnych, TypeScript 5, Tailwind 4, Shadcn/ui
- Backend: Supabase (autentykacja)
- AI: OpenRouter.ai dla komunikacji z modelami OpenAI 4o
- CI/CD: Github Actions, hosting na DigitalOcean przez Docker

## 2. Problem użytkownika

Osoby uczące się języka angielskiego na poziomie B2/C1 potrzebują regularnego utrwalania słownictwa, aby skutecznie rozwijać swoje umiejętności językowe. Metoda powtórek rozłożonych w czasie (spaced repetition) jest naukowo potwierdzoną techniką nauki, która wymaga jednak przygotowania odpowiednich materiałów w formie fiszek.

Główne problemy, które rozwiązuje aplikacja:

1. Czasochłonność manualnego tworzenia fiszek - Użytkownicy często rezygnują z nauki z powodu czasu potrzebnego na przygotowanie materiałów.
2. Trudność w wyborze odpowiedniego słownictwa - Użytkownicy nie zawsze wiedzą, które słowa i frazy są najbardziej wartościowe na ich poziomie zaawansowania.
3. Brak motywacji do regularnej nauki - Tradycyjne metody powtórek mogą być monotonne i zniechęcające.

FlashcardAI rozwiązuje te problemy poprzez:
- Automatyczne generowanie fiszek z wykorzystaniem AI, co drastycznie skraca czas przygotowania materiałów
- Inteligentne wybieranie słownictwa na poziomie B2/C1 z dowolnego tekstu
- Angażujący format quizu z natychmiastową informacją zwrotną
- Minimalistyczny, przyjazny dla użytkownika interfejs z ciemnym motywem

## 3. Wymagania funkcjonalne

### 3.1 Generowanie fiszek przez AI

- System wykorzystuje model OpenAI 4o do analizy wklejonego tekstu
- Z tekstu o długości do 1500 słów generowane jest do 10 fiszek
- AI identyfikuje przydatne zwroty i słowa na poziomie B2/C1
- Fiszka składa się z angielskiego słowa/frazy (przód) i polskiego tłumaczenia (tył)
- System informuje o ograniczeniu do pierwszych 1500 słów dla dłuższych tekstów
- Wygenerowane fiszki są prezentowane jako "kandydaci" do akceptacji przez użytkownika

### 3.2 Zarządzanie fiszkami

- Przeglądanie wygenerowanych "kandydatów" na fiszki
- Edycja/odrzucanie pojedynczych fiszek
- Akceptacja wygenerowanych fiszek przez przycisk "dodaj fiszki"
- Manualnie dodawanie własnych fiszek przez prosty formularz
- Przeglądanie, edycja i usuwanie zapisanych fiszek w dedykowanym widoku

### 3.3 Quiz

- Prezentacja przodu fiszki (angielskie słowo/fraza)
- Wyświetlanie czterech opcji tłumaczenia (jedna poprawna, trzy generowane ad-hoc)
- Podświetlanie odpowiedzi (zielone dla poprawnych, czerwone dla błędnych)
- Przycisk "Dalej" do przejścia do następnej fiszki
- Losowa kolejność prezentowanych fiszek

### 3.4 System kont użytkowników

- Rejestracja i logowanie przez email/hasło
- Przechowywanie fiszek dla zalogowanych użytkowników
- Możliwość resetowania hasła
- Automatyczne wylogowywanie po określonym czasie nieaktywności

### 3.5 Interfejs użytkownika

- Minimalistyczny design z ciemnym motywem
- Responsywny układ dostosowany do urządzeń desktop i mobilnych
- Cztery główne widoki: quiz (domyślny), dodawanie fiszek AI, dodawanie własnej fiszki, przeglądanie fiszek
- Intuicyjna nawigacja między widokami

### 3.6 Inicjalizacja danych użytkownika

- Każdy nowy użytkownik otrzymuje domyślny zestaw fiszek do nauki
- Domyślny zestaw zawiera podstawowe słownictwo na poziomie B2/C1
- Domyślne fiszki pomagają użytkownikowi od razu rozpocząć naukę bez konieczności tworzenia własnych materiałów
- System automatycznie tworzy domyślny zestaw podczas pierwszego logowania użytkownika

## 4. Wymagania deweloperskie i środowiska

### 4.1 Rozwój lokalny

- Aplikacja musi być możliwa do uruchomienia lokalnie z pełną funkcjonalnością
- Wszystkie funkcje, w tym autentykacja użytkowników, muszą działać w środowisku lokalnym
- Konfiguracja lokalna musi obejmować:
  - Lokalną instancję bazy danych Supabase
  - Konfigurację zmiennych środowiskowych dla API AI
  - Lokalne serwery deweloperskie dla frontendu i backendu
- Dokumentacja setup'u lokalnego musi być dostępna dla deweloperów

### 4.2 Użytkownik demonstracyjny

- System musi zawierać prekonfigurowanego użytkownika demonstracyjnego
- Dane logowania użytkownika demo:
  - Email: demo@example.com
  - Hasło: demo
- Użytkownik demonstracyjny musi mieć:
  - Dostęp do wszystkich funkcji aplikacji
  - Domyślny zestaw fiszek gotowych do nauki
  - Przykładowe dane do prezentacji funkcjonalności

### 4.3 Dane testowe

- System musi zawierać mechanizm automatycznego tworzenia danych testowych
- Dane testowe obejmują:
  - Użytkownika demonstracyjnego z hasłem
  - Zestaw przykładowych fiszek do nauki
  - Przykładowe dane historyczne dla demonstracji funkcjonalności

## 5. Granice produktu

### 5.1 Co nie wchodzi w zakres MVP

- Własny, zaawansowany algorytm powtórek (zostanie wykorzystany gotowy algorytm)
- Import wielu formatów plików (PDF, DOCX, itp.) - obsługiwane jest tylko kopiuj-wklej tekstu
- Współdzielenie zestawów fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne (na początek tylko wersja webowa)
- Organizowanie fiszek w zestawy/kolekcje
- Przeglądanie historii tekstów, z których generowano fiszki
- Wyszukiwanie konkretnych fiszek
- Statystyki nauki dla użytkownika

### 5.2 Ograniczenia techniczne

- Limit 1500 słów dla tekstu wejściowego
- Maksymalnie 10 fiszek generowanych z jednego tekstu
- Brak offline mode - aplikacja wymaga połączenia z internetem
- Brak synchronizacji z zewnętrznymi aplikacjami do nauki
- Brak wsparcia dla innych języków poza angielskim i polskim

## 6. Historyjki użytkowników

### Autentykacja

#### US-001: Rejestracja nowego użytkownika
Jako nowy użytkownik, chcę utworzyć konto, aby móc zapisywać swoje fiszki.

Kryteria akceptacji:
- Formularz rejestracji zawiera pola: email i hasło
- System sprawdza, czy email jest poprawny i unikatowy
- System wymaga hasła o minimalnej długości 8 znaków
- Po rejestracji użytkownik otrzymuje potwierdzenie utworzenia konta
- Użytkownik jest przekierowywany do widoku domyślnego (quiz)
- System automatycznie tworzy domyślny zestaw fiszek dla nowego użytkownika

#### US-002: Logowanie użytkownika
Jako zarejestrowany użytkownik, chcę zalogować się do aplikacji, aby uzyskać dostęp do swoich fiszek.

Kryteria akceptacji:
- Formularz logowania zawiera pola: email i hasło
- System weryfikuje poprawność danych
- W przypadku błędnych danych system wyświetla stosowny komunikat
- Po zalogowaniu użytkownik jest przekierowywany do widoku domyślnego (quiz)
- Sesja użytkownika jest zapamiętywana przez określony czas

#### US-003: Resetowanie hasła
Jako użytkownik, który zapomniał hasła, chcę je zresetować, aby odzyskać dostęp do konta.

Kryteria akceptacji:
- Link "Zapomniałem hasła" jest dostępny na stronie logowania
- Użytkownik może podać email, na który zostanie wysłany link do resetowania hasła
- Po kliknięciu w link użytkownik może ustawić nowe hasło
- System potwierdza zmianę hasła

#### US-004: Logowanie użytkownika demonstracyjnego
Jako deweloper lub osoba testująca aplikację, chcę móc zalogować się na konto demonstracyjne, aby sprawdzić funkcjonalność.

Kryteria akceptacji:
- Konto demo@example.com z hasłem "demo" jest dostępne w systemie
- Użytkownik demonstracyjny ma dostęp do wszystkich funkcji aplikacji
- Konto demonstracyjne zawiera przykładowe fiszki gotowe do nauki
- Logowanie na konto demonstracyjne działa tak samo jak na zwykłe konto użytkownika

### Inicjalizacja danych użytkownika

#### US-005: Automatyczne tworzenie domyślnych fiszek
Jako nowy użytkownik, chcę mieć dostęp do podstawowych fiszek od razu po rejestracji, aby móc rozpocząć naukę.

Kryteria akceptacji:
- System automatycznie tworzy zestaw domyślnych fiszek dla każdego nowego użytkownika
- Domyślne fiszki zawierają słownictwo na poziomie B2/C1
- Zestaw zawiera co najmniej 20 różnorodnych fiszek
- Domyślne fiszki są dostępne natychmiast po pierwszym zalogowaniu
- Użytkownik może edytować lub usunąć domyślne fiszki jak zwykłe fiszki

### Generowanie fiszek przez AI

#### US-006: Wklejanie tekstu do generowania fiszek
Jako użytkownik, chcę wkleić tekst angielski, aby AI wygenerowało fiszki.

Kryteria akceptacji:
- Widok zawiera pole tekstowe do wklejenia tekstu
- System wyświetla licznik słów w czasie rzeczywistym
- System informuje o limicie 1500 słów
- Przycisk "Generuj fiszki" inicjuje proces generowania
- System wyświetla wskaźnik ładowania podczas generowania

#### US-007: Otrzymywanie wygenerowanych fiszek
Jako użytkownik, chcę zobaczyć listę fiszek wygenerowanych przez AI, aby wybrać te, które chcę zachować.

Kryteria akceptacji:
- System wyświetla do 10 wygenerowanych fiszek
- Każda fiszka prezentuje angielskie słowo/frazę i polskie tłumaczenie
- Każda fiszka ma opcje edycji i odrzucenia
- System wyświetla informację, jeśli AI nie mogło wygenerować żadnych fiszek
- Przycisk "Dodaj fiszki" jest widoczny na dole listy

#### US-008: Edytowanie wygenerowanych fiszek
Jako użytkownik, chcę edytować wygenerowane fiszki, aby dostosować je do moich potrzeb.

Kryteria akceptacji:
- Kliknięcie przycisku edycji otwiera formularz edycji
- Formularz zawiera pola do edycji angielskiego słowa/frazy i polskiego tłumaczenia
- Użytkownik może anulować edycję lub zapisać zmiany
- Zmodyfikowane fiszki są wizualnie oznaczone

#### US-009: Odrzucanie niepotrzebnych fiszek
Jako użytkownik, chcę odrzucić niektóre wygenerowane fiszki, aby zachować tylko te, które uważam za przydatne.

Kryteria akceptacji:
- Każda fiszka ma przycisk odrzucenia
- Odrzucone fiszki są usuwane z listy lub wizualnie oznaczone jako odrzucone
- Odrzucone fiszki nie są dodawane do kolekcji użytkownika po kliknięciu "Dodaj fiszki"
- Użytkownik może odrzucić wszystkie fiszki

#### US-010: Akceptacja i zapisywanie fiszek
Jako użytkownik, chcę zatwierdzić wybrane fiszki, aby dodać je do mojej kolekcji.

Kryteria akceptacji:
- Przycisk "Dodaj fiszki" dodaje wszystkie nieodrzucone fiszki do kolekcji użytkownika
- System wyświetla potwierdzenie dodania fiszek
- System informuje o liczbie dodanych fiszek
- Po dodaniu fiszek użytkownik może wrócić do widoku generowania lub przejść do widoku przeglądania

#### US-011: Obsługa zbyt długiego tekstu
Jako użytkownik, chcę otrzymać komunikat, jeśli mój tekst przekracza limit, aby zrozumieć ograniczenia systemu.

Kryteria akceptacji:
- System wyświetla informację, jeśli tekst przekracza 1500 słów
- Komunikat informuje, że tylko pierwsze 1500 słów zostanie wykorzystane
- Użytkownik może kontynuować z okrojonym tekstem lub zmodyfikować wprowadzony tekst
- System obcina tekst do pierwszych 1500 słów przed wysłaniem do AI

### Manualne tworzenie fiszek

#### US-012: Dodawanie własnej fiszki
Jako użytkownik, chcę manualnie dodać własną fiszkę, gdy nie chcę korzystać z AI.

Kryteria akceptacji:
- Widok zawiera formularz z polami: angielskie słowo/fraza i polskie tłumaczenie
- Przycisk "Dodaj fiszkę" zapisuje fiszkę do kolekcji
- System waliduje, czy oba pola są wypełnione
- Po dodaniu fiszki formularz jest czyszczony, aby umożliwić dodanie kolejnej
- System wyświetla potwierdzenie dodania fiszki

### Zarządzanie fiszkami

#### US-013: Przeglądanie zapisanych fiszek
Jako użytkownik, chcę przeglądać wszystkie swoje fiszki, aby ocenić swoją kolekcję.

Kryteria akceptacji:
- Widok wyświetla listę wszystkich zapisanych fiszek
- Każda fiszka pokazuje angielskie słowo/frazę i polskie tłumaczenie
- Przy każdej fiszce dostępne są opcje edycji i usunięcia
- Lista jest przewijalna, jeśli zawiera dużo fiszek
- Fiszki są wyświetlane od najnowszych do najstarszych

#### US-014: Edytowanie zapisanych fiszek
Jako użytkownik, chcę edytować zapisane fiszki, aby poprawić błędy lub zaktualizować treść.

Kryteria akceptacji:
- Kliknięcie przycisku edycji przy fiszce otwiera formularz edycji
- Formularz zawiera pola do edycji angielskiego słowa/frazy i polskiego tłumaczenia
- Użytkownik może anulować edycję lub zapisać zmiany
- System wyświetla potwierdzenie zapisania zmian
- Zaktualizowana fiszka jest natychmiast widoczna na liście

#### US-015: Usuwanie fiszek
Jako użytkownik, chcę usuwać fiszki, których już nie potrzebuję.

Kryteria akceptacji:
- Każda fiszka ma przycisk usunięcia
- Kliknięcie przycisku usunięcia wyświetla prośbę o potwierdzenie
- Po potwierdzeniu fiszka jest usuwana z kolekcji
- System wyświetla potwierdzenie usunięcia fiszki
- Usunięta fiszka znika z listy bez konieczności odświeżania strony

### Quiz i nauka

#### US-016: Rozpoczynanie quizu
Jako użytkownik, chcę rozpocząć quiz, aby uczyć się słówek.

Kryteria akceptacji:
- Widok quizu jest domyślnie wyświetlany po zalogowaniu
- System losowo wybiera fiszkę z kolekcji użytkownika
- System wyświetla angielskie słowo/frazę
- System generuje cztery opcje tłumaczenia (jedna poprawna, trzy niepoprawne)
- Quiz można rozpocząć tylko jeśli użytkownik ma przynajmniej jedną fiszkę

#### US-017: Odpowiadanie na pytania w quizie
Jako użytkownik, chcę widzieć angielskie słowo i wybierać spośród 4 opcji polskich tłumaczeń.

Kryteria akceptacji:
- System wyświetla angielskie słowo/frazę jako pytanie
- Pod pytaniem wyświetlane są cztery opcje tłumaczenia
- Tylko jedna opcja jest poprawna
- Trzy niepoprawne opcje są generowane ad-hoc
- Opcje są wyświetlane w losowej kolejności

#### US-018: Otrzymywanie informacji zwrotnej
Jako użytkownik, chcę otrzymać natychmiastową informację zwrotną o moim wyborze, aby wiedzieć, czy odpowiedziałem poprawnie.

Kryteria akceptacji:
- Po wybraniu odpowiedzi system podświetla ją na zielono, jeśli jest poprawna
- Jeśli odpowiedź jest niepoprawna, system podświetla ją na czerwono i pokazuje poprawną odpowiedź na zielono
- Przycisk "Dalej" staje się aktywny po wybraniu odpowiedzi
- Użytkownik nie może zmienić odpowiedzi po jej wybraniu
- System nie przechodzi automatycznie do następnego pytania

#### US-019: Przechodzenie do następnej fiszki
Jako użytkownik, chcę przejść do następnej fiszki, aby kontynuować naukę.

Kryteria akceptacji:
- Przycisk "Dalej" jest widoczny po wybraniu odpowiedzi
- Kliknięcie przycisku "Dalej" ładuje nową, losowo wybraną fiszkę
- System generuje nowy zestaw odpowiedzi dla nowej fiszki
- System nie powtarza tej samej fiszki w jednej sesji quizu (opcjonalne w MVP)
- Nowa fiszka jest prezentowana bez zbędnych opóźnień

### Interfejs i nawigacja

#### US-020: Nawigacja między widokami
Jako użytkownik, chcę mieć dostęp do nawigacji, aby łatwo przełączać się między różnymi widokami aplikacji.

Kryteria akceptacji:
- Menu nawigacyjne zawiera opcje: "Ucz się" (quiz), "Dodaj fiszki AI", "Dodaj fiszkę", "Przeglądaj fiszki"
- Aktualna lokalizacja jest wyróżniona w menu
- Przełączanie między widokami odbywa się bez przeładowania strony
- Menu jest zawsze widoczne (stałe lub wysuwane)
- Menu jest dostępne na wszystkich ekranach po zalogowaniu

#### US-021: Korzystanie z ciemnego motywu
Jako użytkownik, chcę korzystać z ciemnego motywu, aby zmniejszyć zmęczenie oczu.

Kryteria akceptacji:
- Aplikacja domyślnie używa ciemnego motywu
- Wszystkie elementy interfejsu są czytelne w ciemnym motywie
- Kontrast kolorów spełnia standardy dostępności
- Podświetlenia i akcenty są dobrze widoczne na ciemnym tle
- Komunikaty i powiadomienia są zgodne z motywem

#### US-022: Korzystanie z responsywnego interfejsu
Jako użytkownik mobilny, chcę korzystać z responsywnego interfejsu, aby używać aplikacji na różnych urządzeniach.

Kryteria akceptacji:
- Interfejs dostosowuje się do różnych rozmiarów ekranów
- Wszystkie funkcje są dostępne zarówno na urządzeniach mobilnych, jak i desktopowych
- Elementy interaktywne mają odpowiedni rozmiar na ekranach dotykowych
- Układ dostosowuje się do orientacji urządzenia (pozioma/pionowa)
- Menu nawigacyjne odpowiednio reaguje na zmiany rozmiaru ekranu

### Środowisko deweloperskie

#### US-023: Uruchomienie aplikacji lokalnie
Jako deweloper, chcę móc uruchomić aplikację lokalnie z pełną funkcjonalnością, aby rozwijać i testować kod.

Kryteria akceptacji:
- Wszystkie komponenty aplikacji (frontend, backend, baza danych) działają lokalnie
- Autentykacja użytkowników działa w środowisku lokalnym
- Integracja z API AI jest skonfigurowana i funkcjonalna
- Dokumentacja setup'u lokalnego jest kompletna i aktualna
- Wszystkie zmienne środowiskowe są odpowiednio skonfigurowane

#### US-024: Dostęp do danych demonstracyjnych
Jako deweloper lub tester, chcę mieć dostęp do danych demonstracyjnych, aby móc prezentować funkcjonalność aplikacji.

Kryteria akceptacji:
- Użytkownik demo@example.com z hasłem "demo" jest dostępny w każdym środowisku
- Konto demonstracyjne zawiera reprezentatywny zestaw fiszek
- Dane demonstracyjne przedstawiają różne scenariusze użycia
- Konto demonstracyjne może być łatwo zresetowane do stanu początkowego

## 7. Metryki sukcesu

### 7.1 Wskaźniki produktowe

1. 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkowników
   - Mierzone przez stosunek zaakceptowanych fiszek do wszystkich wygenerowanych
   - Modyfikacja fiszki nie jest liczona ani jako akceptacja, ani jako odrzucenie
   - Monitorowane przez logi generacji w bazie danych

2. 75% fiszek tworzonych jest z wykorzystaniem AI
   - Mierzone przez stosunek fiszek wygenerowanych przez AI do wszystkich fiszek w systemie
   - Każda fiszka ma oznaczenie źródła (AI/manual)
   - Monitorowane przez statystyki w bazie danych

### 7.2 Metryki techniczne

1. Czas generowania fiszek
   - Średni czas od wklejenia tekstu do otrzymania wygenerowanych fiszek
   - Celem jest utrzymanie tego czasu poniżej 5 sekund dla tekstów o długości do 1500 słów

2. Dostępność systemu
   - Uptime aplikacji na poziomie 99%
   - Monitorowanie błędów i problemów z API

3. Responsywność interfejsu
   - Czas ładowania poszczególnych widoków poniżej 2 sekund
   - Płynne przejścia między widokami bez opóźnień

### 7.3 Metryki user experience

1. Częstotliwość korzystania
   - Średnia liczba sesji na użytkownika w tygodniu
   - Średni czas spędzony w aplikacji

2. Ukończenie procesu generowania
   - Procent rozpoczętych procesów generowania, które kończą się dodaniem fiszek
   - Monitoring porzuceń na poszczególnych etapach procesu

3. Aktywność w quizie
   - Średnia liczba pytań na sesję quizu
   - Procent poprawnych odpowiedzi

### 7.4 Metryki deweloperskie

1. Czas setup'u środowiska lokalnego
   - Maksymalny czas potrzebny do uruchomienia aplikacji lokalnie: 30 minut
   - Mierzony od sklonowania repozytorium do pierwszego udanego logowania

2. Pokrycie funkcjonalności w środowisku lokalnym
   - 100% funkcji dostępnych w produkcji musi działać lokalnie
   - Wszystkie user stories muszą być testowalne lokalnie