const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'temperatures.json');

// Sicherstellen, dass das Datenverzeichnis existiert
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

// Verlauf aus Datei laden
function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Eintrag anhängen und Datei speichern
function saveEntry(entry) {
  const history = loadHistory();
  history.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
}

// Letzten gespeicherten Wert beim Start wiederherstellen
const history = loadHistory();
let currentTemperature = history.length ? history[history.length - 1].temperature : null;
let lastUpdated = history.length ? history[history.length - 1].timestamp : null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { etag: false, setHeaders: (res) => {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
} }));

// GET: Aktuelle Temperatur abrufen
app.get('/api/temperature', (req, res) => {
  res.json({
    temperature: currentTemperature,
    lastUpdated: lastUpdated,
    unit: '°C'
  });
});

// GET: Temperaturverlauf abrufen
app.get('/api/temperature/history', (req, res) => {
  res.json(loadHistory());
});

// POST: Temperatur setzen (Body: { "temperature": 22.5 })
app.post('/api/temperature', (req, res) => {
  const { temperature } = req.body;
  const value = parseFloat(temperature);

  if (typeof value !== 'number' || isNaN(value)) {
    return res.status(400).json({
      error: 'Ungültiger Wert. Bitte eine Zahl senden (z.B. { "temperature": 22.5 })'
    });
  }

  currentTemperature = value;
  lastUpdated = new Date().toISOString();

  saveEntry({ temperature: currentTemperature, timestamp: lastUpdated });

  res.json({
    success: true,
    temperature: currentTemperature,
    lastUpdated
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
