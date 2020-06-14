// slideShow.js
//
// Implements static slideshow of an algoritm visualization which can be
// viewed step by step by clicking buttons on the GUI.

class DOMSlideShow {
  stepCount = -1;

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
      this.canvases.student.innerHTML = '<h3>Ended</h3>';
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

module.exports = { DOMSlideShow }
