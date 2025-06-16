class Bullet {
  constructor(x, y, dx, dy, size) {
    this.x = x;
    this.y = y;
    this.dx = dx * velBul; // Applica la velocità ai vettori direzionali
    this.dy = dy * velBul;
    this.size = size;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  display() {
    strokeWeight(0);
    stroke(255);
    strokeWeight(this.size);
    point(this.x, this.y);
  }

  contbullet() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}
