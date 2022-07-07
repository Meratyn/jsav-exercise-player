// animation.js
//
// This is similar to slideShow.js, but implements animation functionality
// with timing.

class DOMAnimation {
  stepCount = 0;
  paused = true;
  constructor(initialStateHTML, animationSteps, canvas) {
    this.initialStateHTML = initialStateHTML;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
  }

  isPaused() {
    return this.paused;
  }

  play($speedInput) {
    if(!this.paused) this.stop();
    this.paused = false;
    this.interval = setInterval(() => this.stepForward(), $speedInput.val()*-1)
  }

  stepForward() {
    if (this.stepCount < this.animationSteps.length) {
      this.setCanvas()
      this.stepCount++;
    } else {
      clearInterval(this.interval);
    }
  }

  pause() {
    clearInterval(this.interval);
    this.paused = true;
  }

  stop() {
    clearInterval(this.interval);
    this.paused = true;
    this.stepCount = 0;
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

module.exports = {
  DOMAnimation
}
