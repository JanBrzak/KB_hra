// ----- Map Data -----
let map = [

  "############################################################",
  "#                                 |˄|              |D|     #",
  "#     #####  #####                                         #",
  "#     8|◧#   #◨|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     0|◧#   #◨|0                                         #",
  "#     #####  #####                                         #",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     0|◧#   #◨|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                                                       _  #",
  "#                                                       D| #",
  "#     #####  #####                                      ￣ #",
  "#     C|▯#  #▯|Ↄ                                         #",
  "#     #####  #####                                      -⌼#",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     C|▯#  #▯|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     C|▯#  #▯|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                      ###                                 #",
  "#                      📰|                                 #",
  "#                      ###                              |D|#",
  "############################################################"
].map(r => r.split(""));

// ----- Player -----
let player = { x: 1, y: 10 };
const walkable = [" ", "C","Ↄ","D","˄"];

// ----- Tile Actions -----
const tileActions = {
  "C": () => {
    const menu = document.getElementById("menu");
    menu.style.display = "block";
    
    menu.innerHTML = `
      <h3>Práce</h3>
      <button onclick="doWork()">Pracovat</button>
      <button onclick="doSlack()">Flákat se</button>
      <button onclick="doLeave()">Odejít</button>
    `;
  },
  "Ↄ": () => {
    const menu = document.getElementById("menu");
    menu.style.display = "block";
    
    menu.innerHTML = `
      <h3>Práce</h3>
      <button onclick="doWork()">Pracovat</button>
      <button onclick="doSlack()">Flákat se</button>
      <button onclick="doLeave()">Odejít</button>
    `;
  }
};

// ----- Draw Map -----
function draw() {
  let out = "";
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (x === player.x && y === player.y) {
        out += `<span class="player">O</span>`;
      } else {
        const ch = map[y][x];
        if (ch === "C" || ch === "Ↄ" || ch === "⌼" || ch === "-") out += `<span class="chest">${ch}</span>`;
        else if (ch === "◧" || ch === "◨" || ch === "▯") out += `<span class="block">${ch}</span>`;
        else if (ch === "D" || ch === "˄" || ch === "v") out += `<span class="door">${ch}</span>`;
        else if (ch === "0" ) out += `<span class="coworker">${ch}</span>`;
        else out += ch;
      }
    }
    out += "\n";
  }
  document.getElementById("map").innerHTML = out;
}

// ----- Player Movement -----
function move(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) return;

  const tile = map[ny][nx];

  if (walkable.includes(tile)) {
    player.x = nx;
    player.y = ny;
    draw();

    const menu = document.getElementById("menu");

    // Show menu only when standing on a tile with an action
    if (tileActions[tile]) {
      menu.style.display = "block";
      tileActions[tile]();
    } else {
      menu.style.display = "none";
      menu.innerHTML = "";
    }
  }
}
// Track how many times worked today
let workCount = 0;
const maxWorkPerDay = 3;

// Update navbar display
function updateStatsDisplay() {
  document.getElementById("stat-hydration").textContent = stats.hydration;
  document.getElementById("stat-food").textContent = stats.food;
  document.getElementById("stat-money").textContent = stats.money;
  document.getElementById("stat-stress").textContent = stats.stress;

  const h = stats.hours.toString().padStart(2, "0");
  const m = stats.minutes.toString().padStart(2, "0");
  document.getElementById("stat-time").textContent = `${h}:${m}`;
}

// ---------- Work action ----------
function doWork() {
  if (workCount >= maxWorkPerDay) {
    alert("You cannot work more than 3 times per day!");
    return;
  }

  workCount++;

  // Stress +15%
  stats.stress = Math.min(100, stats.stress + 15);

  // Money random 150-400
  const moneyEarned = Math.floor(Math.random() * (400 - 150 + 1)) + 150;
  stats.money += moneyEarned;

  // Hunger -5%
  stats.food = Math.max(0, stats.food - 5);

  // Thirst -5, max 60
  stats.hydration = Math.max(0, Math.min(60, stats.hydration - 5));

  // Time +4 hours
  stats.hours += 4;
  if (stats.hours >= 24) {
    stats.hours -= 24;
    workCount = 0; // reset for new day
  }

  updateStatsDisplay();

  // Alert only shows money earned this work session
  alert(`You worked! Money earned this time: $${moneyEarned}, Stress: ${stats.stress}%`);

  // Close menu
  const menu = document.getElementById("menu");
  menu.style.display = "none";
  menu.innerHTML = "";
}


// ---------- Slack action ----------
function doSlack() {
  stats.stress = Math.max(0, stats.stress - 5);
  updateStatsDisplay();
  alert("You decided to slack off! Stress decreased.");
  const menu = document.getElementById("menu");
  menu.style.display = "none";
  menu.innerHTML = "";
}

// ---------- Leave action ----------
function doLeave() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
  menu.innerHTML = "";
}


// ----- Interaction System -----
// Interactions by map and coordinates (standing next to tile, e.g. NPCs)
// This will be handled in interactions.js

// Utility: get adjacent coordinates
function getAdjacentCoords(x, y) {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1]
  ];
}

// Enhanced checkInteraction for 'standing next to' interactions
function checkInteraction() {
  if (typeof window.interactions !== 'object') return;
  const currentMapId = document.body.getAttribute("data-map-id") || "office";
  // Check all adjacent tiles
  const adjCoords = getAdjacentCoords(player.x, player.y);
  for (const [ax, ay] of adjCoords) {
    const key = `${ax},${ay}`;
    if (window.interactions[currentMapId] && window.interactions[currentMapId][key]) {
      window.interactions[currentMapId][key]();
      return;
    }
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "e" || e.key === "E") {
    checkInteraction();
  }
});

// ----- Keyboard Input -----
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") move(0, -1);
  if (e.key === "ArrowDown" || e.key === "s") move(0, 1);
  if (e.key === "ArrowLeft" || e.key === "a") move(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") move(1, 0);
});

// ----- Initial Draw -----
draw();
