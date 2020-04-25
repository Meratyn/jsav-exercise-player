class DOMAnimation {
  stepCount = 0;
  paused = true;
  constructor(initialStateDOM, animationSteps, canvas) {
    this.initialStateDOM = initialStateDOM;
    this.animationSteps = animationSteps;
    this.canvas = canvas;
  }

  isPaused() {
    return this.paused;
  }

  play(speed) {
    if(!this.paused) this.stop();
    this.paused = false;
    this.interval = setInterval(() => this.stepForward(), speed)
  }

  stepForward() {
    if (this.stepCount < this.animationSteps.length) {
      this.canvas.innerHTML = this.animationSteps[this.stepCount].animationDOM;
      this.stepCount++;
    } else {
      clearInterval(this.interval);
      this.canvas.innerHTML = '<h3>Ended</h3>';
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
    this.canvas.innerHTML = this.initialStateDOM
  }
}

module.exports = {
  DOMAnimation
}
