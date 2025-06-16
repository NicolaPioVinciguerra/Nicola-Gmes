class Ship {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.angle = 11;
    this.vel = 4;
    this.lives = 3;
    this.powerUps = []; // Power-up raccolti
    this.shieldActive = false; // Scudo attivo
    this.raddoppiareActive = false; // Attiva triplo colpo
    this.raddoppiareTimer = 0; // Timer durata
  }

  update() {
    // Controlli da tastiera
if (keyIsDown(65)) this.angle -= 0.05; // A
if (keyIsDown(68)) this.angle += 0.05; // D
if (keyIsDown(87)) { // W
  this.x += cos(this.angle) * this.vel;
  this.y += sin(this.angle) * this.vel;
}
if (keyIsDown(83)) { // S
  this.x -= cos(this.angle) * (this.vel - 1);
  this.y -= sin(this.angle) * (this.vel - 1);
}

// Controlli da joystick XBOX 
let gp = navigator.getGamepads()[0];
if (gp) {
  if (gp.buttons[14].pressed) this.angle -= 0.05; // Sinistra
  if (gp.buttons[15].pressed) this.angle += 0.05; // Destra
  if (gp.buttons[12].pressed) { // Avanti
    this.x += cos(this.angle) * this.vel;
    this.y += sin(this.angle) * this.vel;
  }
  if (gp.buttons[13].pressed) { // Indietro
    this.x -= cos(this.angle) * (this.vel - 1);
    this.y -= sin(this.angle) * (this.vel - 1);
  }
}

 
    // Controlli da gamepad
   /*  let gamepad = navigator.getGamepads();
    let gp = gamepad[0];
    if (gp) {
      if (nf(gp.axes[0], 1, 2) < 0) this.angle -= 0.05;
      if (nf(gp.axes[0], 1, 2) > 0) this.angle += 0.05;
      if (nf(gp.axes[1], 1, 2) < 0) {
        this.x += cos(this.angle) * this.vel;
        this.y += sin(this.angle) * this.vel;
      }
      if (nf(gp.axes[1], 1, 2) > 0) {
        this.x -= cos(this.angle) * (this.vel - 1);
        this.y -= sin(this.angle) * (this.vel - 1);
      }
    }*/

    // Teletrasporto
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;


// Attiva scudo con Q o pulsante 4 del joystick
if ((keyIsDown(81) || (gp && gp.buttons[4].pressed)) && this.hasPowerUp("scudo") && !this.shieldActive) {
  this.shieldActive = true;
  this.removePowerUp("scudo");
}

// Attiva raddoppio attacco con 2 o pulsante 5 del joystick
if ((keyIsDown(50) || (gp && gp.buttons[5].pressed)) && this.hasPowerUp("raddoppiare") && !this.raddoppiareActive) {
  this.raddoppiareActive = true;
  this.raddoppiareTimer = millis();
  this.removePowerUp("raddoppiare");
}


    // Disattiva triplo colpo dopo 10 secondi
    if (this.raddoppiareActive && millis() - this.raddoppiareTimer > 10000) {
      this.raddoppiareActive = false;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + PI / 2);
    fill(251, 186, 0);
    noStroke();
    beginShape();
    vertex(0, -15);
    vertex(-12, 10);
    vertex(-6, 8);
    vertex(6, 8);
    vertex(12, 10);
    endShape(CLOSE);

    // Scudo
    if (this.shieldActive) {
      noFill();
      stroke(0, 200, 255);
      strokeWeight(3);
      ellipse(0, 0, 40, 40);
    }
    pop();
  }

  shoot(size = 5) {
    let bullets = [];
    if (this.raddoppiareActive) {
      bullets.push(this._createBullet(this.angle, size));
      bullets.push(this._createBullet(this.angle - 0.2, size));
      bullets.push(this._createBullet(this.angle + 0.2, size));
    } else {
      bullets.push(this._createBullet(this.angle, size));
    }
    return bullets;
  }

  _createBullet(angle, size) {
    let tipX = this.x + 15 * cos(angle);
    let tipY = this.y + 15 * sin(angle);
    let velpro = 6;
    let dx = velpro * cos(angle);
    let dy = velpro * sin(angle);
    return new Bullet(tipX, tipY, dx, dy, size);
  }

  hit() {
    if (this.shieldActive) {
      this.shieldActive = false;
      return;
    }

    this.lives--;
    if (typeof au4 !== "undefined" && au4.isLoaded()) {
      au4.play();
    }
    if (this.lives <= 0) {
      console.log("Game Over");
      state = 3;
    }
  }

  // ----------- Power-Up -----------
  addPowerUp(type) {
    if (type == "vitaextra") {
      if (this.lives < 5) this.lives++;
    } else if (!this.hasPowerUp(type)) {
      this.powerUps.push(type);
    }
  }

  hasPowerUp(type) {
    return this.powerUps.includes(type);
  }

  removePowerUp(type) {
    let i = this.powerUps.indexOf(type);
    if (i !== -1) this.powerUps.splice(i, 1);
  }

  displayPowerUps() {
    textAlign(CENTER);
    textSize(20);
    fill(255);
    let y = 40;

    for (let i = 0; i < this.powerUps.length; i++) {
      let pu = this.powerUps[i];
      let txt = "";
      if (pu === "scudo") txt = "SCUDO";
      if (pu === "raddoppiare") txt = "TRIPLO COLPO";
      text(txt, width / 2, y + i * 30);
    }
  }
}
