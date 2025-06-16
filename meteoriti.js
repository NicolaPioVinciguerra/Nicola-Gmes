class Meteorite {
  static score = 0;

  constructor(x, y, size = null, level = 0) {
    this.x = x;
    this.y = y;
    this.level = level;

    // Dimensione casuale se non specificata: 10% grandi, 30% medi, 60% piccoli
    if (size == null) {
      let chance = random(1);
      if (chance < 0.1) {
        this.size = random(100, 150); // Grande
      } else if (chance < 0.4) {
        this.size = random(60, 100);  // Medio
      } else {
        this.size = random(30, 60);   // Piccolo
      }
    } else {
      this.size = size;
    }

    this.speed = random(1, 3);
    this.angle = random(TWO_PI);
    this.pixels = [];
    this.baseGray = floor(random(100, 160)); // Grigio base stile pietra
    this.craters = [];
    this.generateShape();
    this.generateCraters();
  }

  generateShape() {
    // Crea una forma tondeggiante con pixel quadrati
    let radius = this.size / 2;
    let step = 5; // grandezza pixel
    for (let x = -radius; x <= radius; x += step) {
      for (let y = -radius; y <= radius; y += step) {
        if (dist(0, 0, x, y) < radius && random() < 0.9) {
          this.pixels.push({ x, y, w: step, h: step });
        }
      }
    }
  }

  generateCraters() {
    // Aggiunge crateri scuri per l'effetto meteorite
    let count = floor(random(2, 5));
    for (let i = 0; i < count; i++) {
      this.craters.push({
        x: random(-this.size / 2.5, this.size / 2.5),
        y: random(-this.size / 2.5, this.size / 2.5),
        w: floor(random(5, 10)),
        h: floor(random(5, 10)),
        shade: floor(random(30, 70))
      });
    }
  }

  update() {
    // Movimento continuo con ritorno dai bordi
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    if (this.x > width + this.size) this.x = -this.size;
    else if (this.x < -this.size) this.x = width + this.size;
    if (this.y > height + this.size) this.y = -this.size;
    else if (this.y < -this.size) this.y = height + this.size;
  }

  display() {
    push();
    translate(this.x, this.y);

    // Disegno del corpo del meteorite
    noStroke();
    fill(this.baseGray);
    for (let p of this.pixels) {
      rect(p.x, p.y, p.w, p.h);
    }

    // Crateri scuri
    for (let c of this.craters) {
      fill(c.shade);
      rect(c.x, c.y, c.w, c.h);
    }

    pop();
  }

  split() {
    // Divide il meteorite se non troppo piccolo
    Meteorite.score += 10;
    if (this.level < 2) {
      let newSize = this.size / 2;
      let m1 = new Meteorite(this.x + newSize, this.y + newSize, newSize, this.level + 1);
      let m2 = new Meteorite(this.x - newSize, this.y - newSize, newSize, this.level + 1);
      return [m1, m2];
    } else {
      return [];
    }
  }

  hitsPoint(px, py) {
    // Collisione con punto (es: proiettile)
    let d = dist(this.x, this.y, px, py);
    return d < this.size;
  }
}
