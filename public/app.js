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

// --- Verlauf / Graph ---
const historyBtn = document.getElementById('historyBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
let chartInstance = null;

function openHistoryModal() {
  fetch('/api/temperature/history')
    .then(res => res.json())
    .then(data => {
      modalOverlay.classList.add('active');

      const labels = data.map(e => {
        const d = new Date(e.timestamp);
        return d.toLocaleString('de-DE', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      });
      const values = data.map(e => e.temperature);

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(document.getElementById('historyChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Temperatur (°C)',
            data: values,
            borderColor: '#7eb8da',
            backgroundColor: 'rgba(126, 184, 218, 0.1)',
            borderWidth: 2,
            pointRadius: data.length > 100 ? 0 : 3,
            tension: 0.3,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#e8e8e8' } }
          },
          scales: {
            x: {
              ticks: { color: '#a0a0a0', maxTicksLimit: 8, maxRotation: 30 },
              grid: { color: 'rgba(255,255,255,0.08)' }
            },
            y: {
              ticks: { color: '#a0a0a0' },
              grid: { color: 'rgba(255,255,255,0.08)' }
            }
          }
        }
      });
    });
}

historyBtn.addEventListener('click', openHistoryModal);
modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});
