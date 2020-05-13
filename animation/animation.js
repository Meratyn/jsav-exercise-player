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
      this.canvas.animationCanvas.innerHTML = '<h3>Ended</h3>';
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

  setCanvas() {
    if(this.animationSteps[this.stepCount].type.includes('model')) {
      this.canvas.modelAnswerCanvas.innerHTML = this.animationSteps[this.stepCount].modelAnswerHTML;
    } else {
      this.canvas.animationCanvas.innerHTML = this.animationSteps[this.stepCount].animationHTML;
      this.canvas.modelAnswerCanvas.innerHTML = '';
    }
  }

}

module.exports = {
  DOMAnimation
}
