class DOMSlideShow {
  currentStep = 0;
  constructor(initialStateHTML, animationSteps, canvas, stepDisplay) {
    this.initialStateHTML = initialStateHTML;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
    this.stepDisplay = stepDisplay;
    this.setCanvas();
  }

  backward() {
    if (this.currentStep > 0 && this.animationSteps.length > 0) {
      this.currentStep--;
      this.setCanvas();
    } else {
      this.reset();
    }
  }

  forward() {
    if (this.currentStep < this.animationSteps.length - 1) {
      this.currentStep++;
      this.setCanvas();
    } else {
      this.canvas.animationCanvas.innerHTML = '<h3>Ended</h3>';
      let total = this.animationSteps.length;
      this.stepDisplay.text(total + " / " + total);
    }
  }

  toEnd() {
    if (this.animationSteps.length > 1) {
      this.currentStep = this.animationSteps.length;
      this.setCanvas();
    } else {
      this.reset();
    }
  }

  reset() {
    this.currentStep = 0;
    this.canvas.animationCanvas.innerHTML = this.initialStateHTML;
  }

  setCanvas() {
    let current = this.currentStep + 1;
    let total = this.animationSteps.length;
    this.stepDisplay.text(current + " / " + total);
  }

}

module.exports = { DOMSlideShow }
