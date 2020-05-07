class DOMSlideShow {
  stepCount = -1;
  constructor(initialStateHTML, animationSteps, canvas) {
    this.initialStateHTML = initialStateHTML;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
  }

  backward() {
    if (this.stepCount >= 0) {
      this.canvas.innerHTML = this.animationSteps[this.stepCount].animationHTML;
      this.stepCount--;
    } else {
      this.reset();
    }
  }

  forward() {
    if (this.stepCount < this.animationSteps.length -1) {
      this.stepCount++;
      this.canvas.innerHTML = this.animationSteps[this.stepCount].animationHTML;
    } else {
      this.canvas.innerHTML = '<h3>Ended</h3>';
    }
  }

  toEnd() {
    this.stepCount = this.animationSteps.length -1;
    this.canvas.innerHTML = this.animationSteps[this.stepCount].animationHTML;
  }

  reset() {
    this.stepCount = -1;
    this.canvas.innerHTML = this.initialStateHTML;
  }

}

module.exports = { DOMSlideShow }
