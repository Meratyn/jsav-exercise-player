// slideShow.js
//
// Implements static slideshow of an algoritm visualization which can be
// viewed step by step by clicking buttons on the GUI.

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

  /**
   * update the inner canvas to the new svg image if it exists. 
   */
  setCanvas() {
    if (this.animationSteps[this.stepCount].image) {
      this.canvas.animationCanvas.innerHTML = 
            this.animationSteps[this.stepCount].image;
    } else if (this.animationSteps[this.stepCount].svg) {
      this.canvas.animationCanvas.innerHTML = 
            this.animationSteps[this.stepCount].svg;
    } 
  }

}

module.exports = { DOMSlideShow }
