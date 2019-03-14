# Lista dnevnih zadataka

Aplikacija "Lista zadataka" služi kao svojevrsni podsetnik dnevnih obaveza. U aplikaciju se unose razni dnevni zadaci i u localstorage se pamte zadaci i vreme unosa istih. Klikom na ikonicu za izmenu zadataka moguće je promeniti sam tekst zadatka. Aplikacija automatski beleži vreme dodavanja zadatka. Prilikom dodavanja novog zadatka prikazuje se i ikonica "Novo!" ispred imena teksta zadatka a koja, nakon refresh-a stranice, nestaje.

## Tehnologije izrade

Za izradu korisničkog interfejsa (UI) korišćen je primarno [materialize front-end frejmwork](https://materializecss.com/), kao i custom CSS za određene delove UI-a. Za samu funkcionalnost aplikacije korišćen je javascript.

## Struktura

Sama aplikacija je zamišljena kao Single Page Api (SPA) tako da je ceo UI prilagođen tome. Za izmene, potvrde premeštanja zadataka i potvrde brisanja korišćeni su custom modal-i. Kompletan JS kod se nalazi u zasebnom fajlu unutar JS foldera kao i kompletan CSS kod unutar CSS foldera.

## Uputstvo

U polje "Unesi zadatak" se upisuje zadatak zatim se klikom na "Dodaj zadatak" snima u localstorage (LS) i prikazuje na samoj stranici u sekciji "Zadaci". Tu je moguće promeniti sadržaj zadatka klikom na ikonicu za edit (Izmeni zadatak - narandžasta ikona) ili ga je moguće označiti kao završen zadatak klikom na dugme "Zelena strelica na dole" (Premesti u listu završenih zadataka). Tim postupkom se zadatak briše iz liste zadataka i prebacuje se u LS završenih zadataka. U trenutku obeležavanja zadatka da je završen beleži se i vreme kad je završen i prikazuje pored samog teksta zadatka. Sa liste završenih zadataka moguće je samo izbrisati zadatak po izboru ili obrisati ceo LS završenih zadataka klikom na dugme "Obriši sve zadatke".
