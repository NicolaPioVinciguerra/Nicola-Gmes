class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.type = type; 
    this.active = false;
    this.collected = false;
  }

  update() {
    this.y += 1; // i power-up scendono lentamente
  }

  display() {
    if (this.type == 'vitaextra') {
      fill(0, 255, 0);
    } else if (this.type == 'scudo') {
      fill(0, 0, 255);
    } else if (this.type == 'raddoppiare') {
      fill(255, 0, 0);
    }
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  checkCollision(ship) {
    let d = dist(this.x, this.y, ship.x, ship.y);
    if (d < this.size / 2 + 15) {
      this.collected = true;
      return this.type;
    }
    return null;
  }
}
