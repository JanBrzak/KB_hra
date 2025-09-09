// Initial stats
let stats = {
  hydration: 60,
  food: 100,
  money: 0,
  stress: 0,
  hours: 8,
  minutes: 0
};

// Update the navbar display
function updateStatsDisplay() {
  document.getElementById("stat-hydration").textContent = stats.hydration;
  document.getElementById("stat-food").textContent = stats.food;
  document.getElementById("stat-money").textContent = stats.money;
  document.getElementById("stat-stress").textContent = stats.stress;

  // Format time as HH:MM
  const h = stats.hours.toString().padStart(2, "0");
  const m = stats.minutes.toString().padStart(2, "0");
  document.getElementById("stat-time").textContent = `${h}:${m}`;
}

// Advance time every second (1 second = 1 minute in game)
setInterval(() => {
  stats.minutes += 1;
  if (stats.minutes >= 60) {
    stats.minutes = 0;
    stats.hours += 1;
    if (stats.hours >= 24) stats.hours = 0;
  }
  updateStatsDisplay();
}, 1000);

// Initial display
updateStatsDisplay();