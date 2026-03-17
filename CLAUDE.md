# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RauchBE** is a simple temperature display application (German: "Temperatur Anzeige") with an Express.js backend API and a vanilla JavaScript frontend.

## Commands

```bash
npm install       # Install dependencies
npm start         # Start server on port 3000 (production)
npm run dev       # Start server on port 3000 (development, same as start)
```

Docker:
```bash
docker compose up -d          # Run in background using docker-compose.yml
docker build -t rauchbe .     # Build image manually
docker run -p 3000:3000 rauchbe
```

There are no tests, linting, or build steps configured.

## Architecture

Single-file Express server ([server.js](server.js)) with static frontend in [public/](public/).

- **Storage**: Temperatures are persisted to `data/temperatures.json` (auto-created). Each POST appends `{ temperature, timestamp }` to the array. The last entry is restored into memory on startup.
- **API**: `GET /api/temperature` returns current `{ temperature, lastUpdated, unit }`, `GET /api/temperature/history` returns the full history array, `POST /api/temperature` accepts `{ "temperature": 22.5 }`.
- **Frontend**: [public/app.js](public/app.js) polls `/api/temperature` every 2 seconds via `setInterval` and updates the DOM. Uses German locale (`de-DE`) for timestamp formatting.
- **Port**: Defaults to 3000; configurable via `PORT` environment variable.
