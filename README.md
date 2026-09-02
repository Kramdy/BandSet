# BandSet

Мобильное приложение для концертных плейлистов и голосований музыкантов.

## Локальный запуск

1. Запустите PostgreSQL: `docker compose up -d`.
2. Запустите API: `dotnet run --project server/BandSet.Api --urls http://0.0.0.0:5094`.
3. Скопируйте `.env.example` в `.env` и укажите IP компьютера для физического телефона. Для Android-эмулятора используется `http://10.0.2.2:5094`.
4. Запустите мобильный клиент: `npm start`.

Демо-вход: `maria@blueecho.band` / `demo123`.

## Настройка Dropbox

Скопируйте `server/BandSet.Api/appsettings.Development.example.json` в `appsettings.Development.json` и укажите Dropbox App Key. Этот файл уже исключён из Git. Вместо файла можно передать ключ через переменную окружения PowerShell:

```powershell
$env:Dropbox__AppKey = "ваш-app-key"
```

Redirect URI в Dropbox Developer Console должен совпадать со значением `bandset://dropbox-auth`.

## Важно

Значения PostgreSQL и JWT в `appsettings.json` подходят только для локальной разработки. В production передавайте их через переменные окружения или хранилище секретов.
