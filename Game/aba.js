
class Aba {
  constructor(text) {
    this.text = text;
    this.v = [];
    this.x = [];
    this.y = [];
    this.sp = width / (this.text.length + 2);

    for ( var i = 0; i < this.text.length; i++) {
      this.v[i] = random(1, 5);
      this.x[i] = this.sp * (i + 1);
      this.y[i] = -50;
    }
  }

  update() {
    for (var i = 0; i < this.text.length; i++) {
      this.y[i] += this.v[i];
      if (this.y[i] >= height / 2) {
      this.v[i] = 0;
      }
    }
  }

  display() {
    textSize(40);
    fill(255);
    for (var i = 0; i < this.text.length; i++) {
    text(this.text.charAt(i), this.x[i], this.y[i]);
    }
  }

  allStopped() {
    for (var i = 0; i < this.v.length; i++) {
    if (this.v[i] !== 0) return false;
    }
    return true;
  }
}
