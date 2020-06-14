class DOMSlideShow {
  stepCount = -1;
  constructor(initialStateHTML, animationSteps, canvas) {
    this.initialStateHTML = initialStateHTML;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
  }

  backward() {
    if (this.stepCount > 0 && this.animationSteps.length > 0) {
      this.stepCount--;
      this.setCanvas();
    } else {
      this.reset();
    }
  }

  forward() {
    if (this.stepCount < this.animationSteps.length -1) {
      this.stepCount++;
      this.setCanvas();
    } else {
      this.canvas.animationCanvas.innerHTML = '<h3>Ended</h3>';
    }
  }

  toEnd() {
    if (this.animationSteps.length > 0) {
      this.stepCount = this.animationSteps.length -1;
      this.setCanvas();
    } else {
      this.reset();
    }
  }

  reset() {
    this.stepCount = -1;
    this.canvas.animationCanvas.innerHTML = this.initialStateHTML;
  }

  setCanvas() {
    if(this.animationSteps[this.stepCount].type.includes('model')) {
      this.canvas.modelAnswerCanvas.innerHTML = this.animationSteps[this.stepCount].modelAnswerHTML;
    } else {
      this.canvas.animationCanvas.innerHTML = this.animationSteps[this.stepCount].animationHTML;
    }
  }

}

module.exports = { DOMSlideShow }
