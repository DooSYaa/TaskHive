# Instrukcje instalacji
## API(Katalog 'TaskHiveApi'):
### Wymagania wstępne:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- MySql
### Instalacja zależności
1.  ```
      dotnet restore
    ```
2. Skonfiguruj połączenia z bazą danych w pliku appsettings.json
3. Uruchamianie migracji:
   - Tworzenie migracji: ``` dotnet ef migrations add _Dowolna nazwa migracji_ ```
   - Rozpoczęcie migracji: ``` dotnet ef database update ```
   - (Oprional) Możesz zalogować się do serwera MySql i sprawdzić, czy baza danych została utworzona

Jeśli do tego momentu nie pojawiły się żadne błędy, można uruchomić api: `dotnet run` lub `dotnet watch`
