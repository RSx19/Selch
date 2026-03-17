const temperatureValue = document.getElementById('temperatureValue');
const lastUpdatedEl = document.getElementById('lastUpdated');

const API_BASE = '';

function formatTime(isoString) {
  if (!isoString) return '–';
  const d = new Date(isoString);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateDisplay() {
  fetch(API_BASE + '/api/temperature')
    .then(res => res.json())
    .then(data => {
      if (data.temperature != null) {
        temperatureValue.textContent = Number(data.temperature).toFixed(1);
        lastUpdatedEl.textContent = 'Zuletzt aktualisiert: ' + formatTime(data.lastUpdated);
      } else {
        temperatureValue.textContent = '--';
        lastUpdatedEl.textContent = 'Noch keine Daten empfangen.';
      }
    })
    .catch(() => {
      temperatureValue.textContent = '--';
      lastUpdatedEl.textContent = 'Verbindung zum Server fehlgeschlagen.';
    });
}

updateDisplay();
setInterval(updateDisplay, 2000);
