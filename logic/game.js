// ----- Map Data -----
let map = [
  "             ◼    ◼        ◼◼◼                                ", 
  "             ◼    ◼        ◼    ◼                            ",
  "             ◼    ◼        ◼     ◼                           ",   
  "             ◼◼◼◼◼       ◼      ◼                      ", 
  "             ◼    ◼        ◼     ◼                               ", 
  "             ◼    ◼        ◼    ◼                            ", 
  "             ◼    ◼        ◼◼◼                            ", 
  "############################################################",
  "#                                 |˄|              |D|     #",
  "#     #####  #####                                         #",
  "#     C|◧#   #◨|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     C|◧#   #◨|Ↄ                                         #",
  "#     #####  #####                                         #",
  "#                                                          #",
  "#     #####  #####                                         #",
  "#     C|◧#   #◨|Ↄ                                         #",
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
    menu.innerHTML = "<h3>Práce</h3><p>|Pracovat</p><p>|Flákat se</p><p>|Inventář stolu</p>";
  },
  "Ↄ": () => {
    const menu = document.getElementById("menu");
    menu.style.display = "block";
    menu.innerHTML = "<h3>Práce</h3><p>|Pracovat</p><p>|Flákat se</p><p>|Inventář stolu</p>";
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

// ----- Keyboard Input -----
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") move(0, -1);
  if (e.key === "ArrowDown" || e.key === "s") move(0, 1);
  if (e.key === "ArrowLeft" || e.key === "a") move(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") move(1, 0);
});

// ----- Initial Draw -----
draw();
