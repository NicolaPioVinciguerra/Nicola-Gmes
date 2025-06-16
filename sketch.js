var bullets = [];
var bulletSize = 4;
var velBul = 2; 
var meteorites = [];
var maxMeteorites = 20 ;// PARTI CON 10 METEORITI ALL INIZIO
var state = 0;
var au1, au2, au3, au4, au5;
var au2Started = false;
var au3Played = false;
var au5Played = false;//5ERORE
var N2Font;
var ship;
var triSize = 20;
var spacing = 10;
var xvit, yvit;
var gamepadPressed = false;
var powerUps = [];
var ListpowerUp = ["vitaextra", "scudo", "raddoppiare"];
var TracMonPow = 0;
var PowerUpAttivo = false;
var nemici = []; 
var sfondo, sfondo2,sfondo3;


function preload() {
  au1 = loadSound("Audio/bulletAd.wav"); 
  au2 = loadSound("Audio/home.wav");
  au3 = loadSound("Audio/gameover.wav");
  au4 = loadSound("Audio/meno.wav");
  au5 = loadSound("Audio/gioco.wav");
 
  N2Font = loadFont('Fonts/PixelPurl.ttf');
  sfondo = loadImage("png/sfondo.png");
  sfondo2 = loadImage("png/sfondo2.png");
  sfondo3 = loadImage("png/sfondo3.png");
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  aba = new Aba("NICOLA PIO VINCIGUERRA");
  ship = new Ship();
  au1.setVolume(0.2);
  au2.setVolume(0.3);
  au3.setVolume(0.7);
  textAlign(CENTER);
  textFont(N2Font);
  for (let i = 0; i < 20; i++) {//LISTA METEORITI INIZIALE 
    meteorites.push(spawnMeteorite());
  }
}

function draw() {
  background(0);
  let gp = navigator.getGamepads()[0];
  if (gp) {
  console.log("Gamepad connesso:", gp.id);
   for (let i = 0; i < gp.buttons.length; i++) {
    if (gp.buttons[i].pressed) {
      console.log("Pulsante premuto:", i);
      }
    }
  } 

  if (state == 0) {
    if (!au2Started && au2.isLoaded()) {
      au2.loop();
      au2Started = true;
    }
    aba.update();
    aba.display();
    if (aba.allStopped()) state = 1;
    if (gp && gp.buttons[2].pressed) state = 2;
    textSize(20);
    textFont(N2Font);
    text("PREMI BARRA SPAZIATRICE PER SALTARE", width / 2, height - 20);
  }
  else if (state == 1) { 
    image(sfondo, 0, 0, width, height); 
    fill(255); 
    textSize(85);
    text("ABA ASTEROID", width / 2, height / 2);
    textSize(40);
    text("UN AVVENTURA SPAZIALE", width / 2, height / 2 + 35);
    textSize(35); 
    if (frameCount % 60 < 30)
      text("PREMI IL TASTO START", width / 2, height / 2 + 65);
    if (gp && gp.buttons[9].pressed) state = 2;
  }
  else if (state == 2) {
   background(0);

     if (!au5Played && au5.isLoaded()) {//5ERORE
      au5.loop();
      au5Played = true;
    }

  image(sfondo2, 0, 0, width, height); 
  //nemici
if (frameCount % 100 == 0) {
  nemici.push(Nemico.spawn()); 
}
// Aggiorna nemici e i loro proiettili
Nemico.updateNemici(ship, nemici, bullets);
Nemico.updateEnemyBullets(ship);
  // fine nemici

  let gp = navigator.getGamepads()[0]; // JOYSTICK
  let firePressed =  (gp && gp.buttons[0].pressed); // TASTO E oppure BOTTONE 0 DEL JOYSTICK
  if (firePressed && !gamepadPressed) { // SPARO SOLO SE NON È GIÀ STATO PREMUTO
    let newBullets = ship.shoot(bulletSize);
    bullets.push(...newBullets);
    if (au1.isLoaded()) au1.play();
    gamepadPressed = true; // BLOCCO LO SPARO FINCHÉ NON VIENE RILASCIATO,
  }
  if (!firePressed) {
    gamepadPressed = false;
  }
  au2.stop(); // STOP AUDIO HOME
  au3.stop(); // STOP AUDIO GAMEOVER  

  // OGNI 500 FRAME (~8 secondi) AUMENTA maxMeteorites FINO A 180
  if (frameCount % 500 == 0 && maxMeteorites < 100) {
    maxMeteorites += 10; // aumenta di 40 ogni 8 secondi fino a un massimo di 180
  }
  // AGGIUNTA DEI METEORITI SE NECESSARIO
  if (meteorites.length < maxMeteorites) {
    meteorites.push(spawnMeteorite());
  } 
  ship.update();
  ship.display();
  ship.displayPowerUps(); // MOSTRA POWER-UP ATTIVI
  // VITE VISIVE (TRIANGOLI)
  fill(251, 186, 0);
  noStroke();
  for (let i = 0; i < ship.lives; i++) {
    let x = 20 + i * (triSize + spacing);
    let y = 30;
    triangle(x, y + triSize / 2, x + triSize / 2, y - triSize / 2, x + triSize, y + triSize / 2);
  }

  // PUNTEGGIO
  push();
  textFont(N2Font);
  fill(255);
  textSize(30);
  textAlign(RIGHT, TOP);
  text("PUNTI: " + Meteorite.score, width - 20, 20);
  pop();

  // BULLETS
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    if (bullets[i].contbullet()) {
      bullets.splice(i, 1);
    }
  }
  // METEORITI
  for (let i = meteorites.length - 1; i >= 0; i--) {
    meteorites[i].update();
    meteorites[i].display();
  }
  // POWER-UP CADENTI
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
    powerUps[i].display();
    if (dist(ship.x, ship.y, powerUps[i].x, powerUps[i].y) < 30) {
      ship.addPowerUp(powerUps[i].type);
      powerUps.splice(i, 1);
    }
  }
  // COLLISIONI PROIETTILE - METEORITE
  for (let i = meteorites.length - 1; i >= 0; i--) {
    let m = meteorites[i];
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      if (m.hitsPoint(b.x, b.y)) {
        bullets.splice(j, 1);
        meteorites.splice(i, 1);
        meteorites = meteorites.concat(m.split());
        if (random(1) < 0.1) {
          powerUps.push(new PowerUp(m.x, m.y, random(ListpowerUp)));
        }
        if (meteorites.length < maxMeteorites) {
          meteorites.push(spawnMeteorite());
        }
        break;
      }
    }
  }
  // COLLISIONI METEORITE - NAVE
  for (let i = meteorites.length - 1; i >= 0; i--) {
    if (meteorites[i].hitsPoint(ship.x, ship.y)) {
      meteorites.splice(i, 1);
      ship.hit();
    }
  }
  if (ship.lives <= 0) {
    state = 3;
  }
}
else if (state == 3) {  
  au5.stop();//5ERORE
  background(0);
  au5.stop();
   image(sfondo3 , 0, 0, width, height);
  fill(255);
  textSize(45);
  if (frameCount % 60 < 30)
  textFont(N2Font);
  text("GAME OVER", width / 2, height / 2);
  textSize(20);
  text("IL TUO PUNTEGGIO", width / 2, height / 2 + 20);
  text(Meteorite.score, width / 2, height / 2 + 40);
  text("PREMI R O START PER RIPROVARE", width / 2, height / 2 + 60);
  
  if (!au3Played && au3.isLoaded()) {
    au3.play();
    au3Played = true;
  }

  // XBOX tasto 9 (START) per ricominciare ===
  let gp = navigator.getGamepads()[0];
  if (gp && gp.buttons[9].pressed) {
    ship = new Ship();
    bullets = [];
    meteorites = [];
    maxMeteorites = 15;
    for (let i = 0; i < 5; i++) {
      meteorites.push(spawnMeteorite());
    }
    nemici = [];
    enemyBullets = [];
    state = 2;
    au3Played = false;
    Meteorite.score = 0;
  }
}
}

//POSIZIONE METEORITI
function spawnMeteorite() { 
  let side = floor(random(4));
  let x, y;
  switch (side) {
    case 0: x = random(width); y = -60; break;
    case 1: x = width + 60; y = random(height); break;
    case 2: x = random(width); y = height + 60; break;
    case 3: x = -60; y = random(height); break;
  }
  let size = random([60, 50, 40]);
  return new Meteorite(x, y, size);
}
function keyPressed() {
  if (key == ' ') {
    if (state < 2) {
      state++;
      if (state == 2) {
        Meteorite.score = 0;
        ship = new Ship();
        bullets = [];
        meteorites = [];
        maxMeteorites = 15;
        nemici = [];
        enemyBullets = [];
        for (let i = 0; i < 5; i++) {
          meteorites.push(spawnMeteorite());
        }
        au3Played = false;
      }
    }
  }
  if (state == 2 && (key == 'e' || key == 'E')) {
    let newBullets = ship.shoot(bulletSize);
    bullets.push(...newBullets);
    if (au1.isLoaded()) au1.play();
  }
  if (state == 3 && (key == 'r' || key == 'R')) {
    ship = new Ship();
    bullets = [];
    meteorites = [];
    maxMeteorites = 15;
    for (let i = 0; i < 5; i++) {
    meteorites.push(spawnMeteorite());
    nemici = [];
    enemyBullets = [];
     nemici = [];
        enemyBullets = [];
    }
    state = 2;
    au3Played = false;
    au5Played = false; //5ERORE
    Meteorite.score = 0;
  }
}  
function shootBullet() {
  if (PowerUpAttivo) {
    bullets.push(ship.shoot(bulletSize, -0.2));
    bullets.push(ship.shoot(bulletSize, 0));
    bullets.push(ship.shoot(bulletSize, 0.2));
  } else {
    bullets.push(ship.shoot(bulletSize));
  }
  if (au1.isLoaded()) au1.play();
}
function activatePowerUp() {
  if (ship.hasPowerUp("raddoppiare")) {
    PowerUpAttivo = true;
    TracMonPow = millis();
    ship.removePowerUp("raddoppiare");
  }
}
 

