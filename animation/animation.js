// animation.js
//
// This is similar to slideShow.js, but implements animation functionality
// with timing.

class DOMAnimation {
  stepCount = 0;
  paused = true;

  // Constructor.
  //
  // Parameters:
  // initialStateHTML: initial HTML to be displayed in the view.
  // animationSteps: steps of the slideshow.
  // canvases:
  //   .student:    the DOM object of the student's view (a <div> element)
  //   .modelAnwer: the DOM object of the student's view (a <div> element)
  constructor(initialStateHTML, animationSteps, canvases) {
    this.initialStateHTML = initialStateHTML;
    this.animationSteps = animationSteps;
    this.canvases = canvases;
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
      this.canvases.student.innerHTML = '<h3>Ended</h3>';
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
    this.canvases.student.innerHTML = this.initialStateHTML;
  }

  setCanvas() {
    if(this.animationSteps[this.stepCount].type.includes('model')) {
      this.canvases.modelAnswer.innerHTML = this.animationSteps[this.stepCount].modelAnswerHTML;
    } else {
      this.canvases.student.innerHTML = this.animationSteps[this.stepCount].animationHTML;
    }
  }

}

module.exports = {
  DOMAnimation
}
