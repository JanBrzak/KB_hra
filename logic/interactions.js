// ----- NPC Definitions -----
const npcs = {
  Pafel: {
    name: "Pafel",
    art: `<pre style="font-family:monospace;line-height:1;">
    XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 XXXXXXXXXXXXXXXXXX         XXXXXXXX
XXXXXXXXXXXXXXXX              XXXXXXX
XXXXXXXXXXXXX                   XXXXX
 XXX     _________ _________     XXX      
  XX    I  _xxxxx I xxxxx_  I    XX       
 ( X----I         I         I----X )           
( +I    I      00 I 00      I    I+ )
 ( I    I    __0  I  0__    I    I )
  (I    I______ /   \_______I    I)
   I           ( ___ )           I
   I       :::::::::::::::  _    i
    (      __ ::::::::: ___     /
     (_      (||)_______    _/
       (      ||           /
         (    ||          /
          |(  **         /|
          |  (_________/  |
</pre>`,
    options: [
      { label: "Ahoj Pafle jak jde práce?", action: () => alert("The fields need workers.") },
      { label: "Nemáš cigaretu?", action: () => alert("No cigarettes here.") },
      { label: "Say goodbye", action: () => closeMenu() }
    ]
  },
  merchant: {
    name: "Merchant",
    art: `<pre>...ASCII art...</pre>`,
    options: [
      { label: "Buy items", action: () => alert("Browsing wares...") },
      { label: "Sell items", action: () => alert("Selling goods...") },
      { label: "Leave", action: () => closeMenu() }
    ]
  }
};

// ----- Menu Functions -----
function openMenu(title, options, art = null) {
  const menu = document.getElementById("menu");
  menu.style.display = "block";

  let html = art ? `<div class='npc-art'>${art}</div>` : "";
  html += `<h3>${title}</h3>`;
  options.forEach(opt => {
    html += `<button onclick="(${opt.action.toString()})();">${opt.label}</button>`;
  });

  menu.innerHTML = html;
}

function closeMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
  menu.innerHTML = "";
}

// ----- Work / Slack / Leave -----
function openWorkMenu() {
  openMenu("Práce", [
    { label: "Pracovat", action: () => doWork() },
    { label: "Flákat se", action: () => doSlack() },
    { label: "Odejít", action: () => doLeave() }
  ]);
}

function doWork() {
  if (workCount >= maxWorkPerDay) { alert("You cannot work more than 3 times per day!"); return; }
  workCount++;

  stats.stress = Math.min(100, stats.stress + 15);
  const moneyEarned = Math.floor(Math.random() * (400 - 150 + 1)) + 150;
  stats.money += moneyEarned;
  stats.food = Math.max(0, stats.food - 5);
  stats.hydration = Math.max(0, Math.min(60, stats.hydration - 5));

  stats.hours += 4;
  if (stats.hours >= 24) { stats.hours -= 24; workCount = 0; }

  updateStatsDisplay();
  alert(`You worked! Money earned: $${moneyEarned}, Stress: ${stats.stress}%`);
  closeMenu();
}

function doSlack() {
  stats.stress = Math.max(0, stats.stress - 5);
  updateStatsDisplay();
  alert("You decided to slack off! Stress decreased.");
  closeMenu();
}

function doLeave() {
  closeMenu();
}

// ----- Page/Coordinate Interactions (for standing next to tile, e.g. NPCs) -----
window.interactions = {
  office: {
    "5,7": () => showNPCDialogue("Pafel"), // Pafel interaction at (5,7)
    "15,20": () => showNPCDialogue("merchant"),
    "40,8": () => moveToPage("forest.html")
  },
  forest: {
    "5,5": () => showNPCDialogue("merchant"),
    "10,10": () => moveToPage("office.html")
  }
};

function checkInteraction() {
  const key = `${player.x},${player.y}`;
  if (interactions[currentMapId] && interactions[currentMapId][key]) {
    interactions[currentMapId][key]();
  }
}

// ----- Page Transition -----
function moveToPage(url) {
  savePlayerData(); // implement saving stats, inventory etc.
  window.location.href = url;
}

// ----- Show NPC Dialogue -----
function showNPCDialogue(npcId) {
  const npc = npcs[npcId];
  if (!npc) return console.error("NPC not found:", npcId);

  openMenu(npc.name, npc.options, npc.art);
}
