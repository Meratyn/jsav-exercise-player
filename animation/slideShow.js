class DOMSlideShow {
  stepCount = -1;
  constructor(initialStateDOM, animationSteps, canvas) {
    this.initialStateDOM = initialStateDOM;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
  }

  backward() {
    if (this.stepCount >= 0) {
      this.canvas.innerHTML = this.animationSteps[this.stepCount].animationDOM;
      this.stepCount--;
    } else {
      this.reset();
    }
  }

  forward() {
    if (this.stepCount < this.animationSteps.length -1) {
      this.stepCount++;
      this.canvas.innerHTML = this.animationSteps[this.stepCount].animationDOM;
    } else {
      this.canvas.innerHTML = '<h3>Ended</h3>';
    }
  }

  toEnd() {
    this.stepCount = this.animationSteps.length -1;
    this.canvas.innerHTML = this.animationSteps[this.stepCount].animationDOM;
  }

  reset() {
    this.stepCount = -1;
    this.canvas.innerHTML = this.initialStateDOM;
  }

}

module.exports = { DOMSlideShow }
