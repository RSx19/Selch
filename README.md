# RauchBE – Temperatur Anzeige

Einfaches Projekt mit Frontend (Temperaturanzeige) und API zum Senden der aktuellen Temperatur.

## Starten (lokal)

```bash
npm install
npm start
```

Dann im Browser öffnen: **http://localhost:3000**

## Starten im Container (Docker)

**Image bauen und starten:**

```bash
docker build -t rauchbe-temperature .
docker run -p 3000:3000 rauchbe-temperature
```

**Mit Docker Compose:**

```bash
docker compose up -d
```

Die App läuft dann unter **http://localhost:3000**. Port lässt sich z. B. anpassen mit `-p 8080:3000` bzw. in `docker-compose.yml` unter `ports`.

## API

- **GET** `/api/temperature` – liefert die aktuell gespeicherte Temperatur (und Zeitstempel).
- **POST** `/api/temperature` – setzt die Temperatur.

Beispiel (Temperatur senden):

```bash
curl -X POST http://localhost:3000/api/temperature -H "Content-Type: application/json" -d "{\"temperature\": 22.5}"
```

Body-Format: `{ "temperature": 22.5 }` (Zahl, z.B. in °C).

Das Frontend aktualisiert die Anzeige alle 2 Sekunden automatisch.
