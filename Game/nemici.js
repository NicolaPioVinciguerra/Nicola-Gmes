class Nemico {
  constructor(x, y, tipo) {
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.size = 40;
    this.speed = random(1.2, 2.2);
    this.lastShot = millis();
    this.shotDelay = random(1500, 2500);
    
  }

  
  update(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    if (millis() - this.lastShot > this.shotDelay) {
      Nemico.enemyBullets.push({
        x: this.x,
        y: this.y,
        angle: angle,
        speed: 4
      });
      au1.play();
      this.lastShot = millis();
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    stroke(255);
    strokeWeight(2);
    noFill();

    let c = Nemico.getColor(this.tipo);
    fill(c);
    stroke(c);

    switch (this.tipo) {
      // PRIME 6 NAVI (uguali alle tue)
        case 0:
        // Scarabeo
        beginShape();
        vertex(-15, -10);
        vertex(-5, -10);
        vertex(-5, -5);
        vertex(5, -5);
        vertex(5, -10);
        vertex(15, -10);
        vertex(15, 0);
        vertex(10, 0);
        vertex(10, 5);
        vertex(5, 5);
        vertex(5, 10);
        vertex(-5, 10);
        vertex(-5, 5);
        vertex(-10, 5);
        vertex(-10, 0);
        vertex(-15, 0);
        endShape(CLOSE);
        break;

      case 1:
        // Polipo
        beginShape();
        vertex(-10, -10);
        vertex(10, -10);
        vertex(10, 0);
        vertex(5, 5);
        vertex(10, 10);
        vertex(5, 10);
        vertex(0, 5);
        vertex(-5, 10);
        vertex(-10, 10);
        vertex(-5, 5);
        vertex(-10, 0);
        endShape(CLOSE);
        break;

      case 2:
        // Granchio
        beginShape();
        vertex(-15, -10);
        vertex(15, -10);
        vertex(15, -5);
        vertex(5, -5);
        vertex(5, 0);
        vertex(15, 0);
        vertex(15, 10);
        vertex(10, 10);
        vertex(0, 5);
        vertex(-10, 10);
        vertex(-15, 10);
        vertex(-15, 0);
        vertex(-5, 0);
        vertex(-5, -5);
        vertex(-15, -5);
        endShape(CLOSE);
        break;

      case 3:
        // UFO classico
        ellipse(0, 0, 40, 20);
        rect(-15, 0, 30, 5);
        break;

      case 4:
        // Insetto volante stilizzato
        beginShape();
        vertex(-10, -10);
        vertex(10, -10);
        vertex(5, 0);
        vertex(10, 10);
        vertex(0, 5);
        vertex(-10, 10);
        vertex(-5, 0);
        endShape(CLOSE);
        break;

        case 5:
      // Nave madre spaziale stilizzata e s
      beginShape();
      vertex(-30, 10);   // angolo sinistro 
      vertex(-20, -20);  // angolo sinistro alto
      vertex(-10, -30);  // punta centrale
      vertex(10, -30);   // punta centrale 
      vertex(20, -20);   // angolo destro alto
      vertex(30, 10);    // angolo destro 
      endShape(CLOSE);
      // Dettagli: "motori" o "armi"
      rect(-20, 10, 5, 10);
      rect(0, 10, 5, 10);
      rect(15, 10, 5, 10);
      break;

      case 6:
        // Nave madre (boss)
        rect(-20, -10, 40, 20);
        rect(-10, -20, 20, 10);
        rect(-5, 10, 10, 5);
        break;

    case 7: // Viola mothership
      rect(-20, -10, 40, 20);
      ellipse(-15, -15, 10, 10);
      ellipse(15, -15, 10, 10);
      break;

    case 8: // Bianco mothership 2
      rect(-25, -10, 50, 20);
      triangle(-25, 10, 0, 25, 25, 10);
      break;

    case 9: // Rosso boss
      ellipse(0, 0, 60, 40);
      rect(-10, -20, 20, 5);
      triangle(-30, 0, -40, 10, -20, 10);
      triangle(30, 0, 40, 10, 20, 10);
      break;

      case 10: // Verde scuro ufo (arco più piccolo + rettangolo più largo)
        arc(0, 0, 30, 15, PI, 0);
        rect(-25, 0, 50, 7);
        break;

      case 11: // Blu insetto (poligono appuntito)
        beginShape();
        vertex(-20, -5);
        vertex(-15, -15);
        vertex(15, -15);
        vertex(20, -5);
        vertex(15, 15);
        vertex(-15, 15);
        endShape(CLOSE);
        break;

      case 12: // Viola croce (rettangoli sovrapposti)
        rect(-5, -20, 10, 40);
        rect(-20, -5, 40, 10);
        break;

      case 13: // Arancione doppio rettangolo
        rect(-20, -15, 40, 15);
        rect(-15, 0, 30, 15);
        break;

      case 14: // Rosa triangolo rovesciato eliminare
        triangle(-15, 15, 0, -15, 15, 15);
        break;
    }
    pop();
  }

  hits(x, y) {
    return dist(this.x, this.y, x, y) < this.size / 2;
  }

  static updateNemici(ship, nemici, bullets) {
    for (let i = nemici.length - 1; i >= 0; i--) {
      let n = nemici[i];
      n.update(ship.x, ship.y);
      n.display();

      if (n.hits(ship.x, ship.y)) {
        ship.hit();
        nemici.splice(i, 1);
        continue;
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        if (n.hits(bullets[j].x, bullets[j].y)) {
          bullets.splice(j, 1);
          nemici.splice(i, 1);
          Meteorite.score += 50;
          break;
        }
      }
    }
  }

  static updateEnemyBullets(ship) { 
    for (let i = Nemico.enemyBullets.length - 1; i >= 0; i--) {
      let b = Nemico.enemyBullets[i];
      b.x += cos(b.angle) * b.speed;
      b.y += sin(b.angle) * b.speed;

      stroke(255, 0, 0);
      strokeWeight(3);
      point(b.x, b.y);

      if (dist(b.x, b.y, ship.x, ship.y) < 20) {
        ship.hit();
        Nemico.enemyBullets.splice(i, 1);
        continue;
      }

      if (b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
        Nemico.enemyBullets.splice(i, 1);
      }
    }
  }

  static spawn() {
    let side = floor(random(4));
    let x, y;
    switch (side) {
      case 0: x = random(width); y = -40; break;
      case 1: x = width + 40; y = random(height); break;
      case 2: x = random(width); y = height + 40; break;
      case 3: x = -40; y = random(height); break;
    }
    let tipo = Nemico.pickTipoRaro();
    return new Nemico(x, y, tipo);
  }

  static pickTipoRaro() {
    let r = random(100);
    if (r < 40) return floor(random(0, 6));       // 0–5 comuni (40%)
    if (r < 65) return floor(random(6, 10));      // 6–9 semi-rari (25%)
    return floor(random(10, 15));                  // 10–14 rari (35%)
  }

  static getColor(tipo) {
    const colors = [
      '#00FF00', // Verde pixel
      '#FF00FF', // Magenta invader
      '#00FFFF', // Cyan scarabeo
      '#FF99CC', // Rosa ufo
      '#0055ff', // Blu granchio
      '#FFFF00', // Giallo ragno
      '#66CCFF', // Celeste alieno
      '#9933FF', // Viola mothership
      '#FFFFFF', // Bianco mothership 2
      '#FF0000', // Rosso boss
      '#007700', // Verde scuro ufo
      '#000077', // Blu insetto
      '#770077', // Viola croce
      '#FF6600', // Arancione doppio rettangolo
      '#FF6699'  // Rosa triangolo rovesciato
    ];
    return colors[tipo] || '#FFFFFF';
  }
}

Nemico.enemyBullets = [];
