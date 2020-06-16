// model-answer-view.js
//
// Binds GUI buttons of the Model answer view

const { DOMAnimation } = require('./animation.js');
const { DOMSlideShow } = require('./slideShow.js');

function initializeSlideShow(initialStateHTML, animationSteps, canvas,
controls) {
  try {
    var slideShow = new DOMSlideShow(initialStateHTML, animationSteps, canvas,
      controls);
  } catch (err) {
    console.warn(`Error when initializing slideshow: ${err}`);
  }
  try {
    $('#model-answer-to-beginning').on('click', () => slideShow.reset());
    $('#model-answer-step-backward').on('click', () => slideShow.backward());
    $('#model-answer-step-forward').on('click', () => slideShow.forward());
    $('#model-answer-to-end').on('click', () => slideShow.toEnd());
  } catch (err) {
    console.warn(`Error when setting listeners for slideshow: ${err}`);
  }
}

function initializeAnimation(initialStateHTML, animationSteps, canvas) {
  const $playPauseButton = $("#model-answer-play-pause-button");
  const $stopButton = $("#model-answer-stop-button");
  const $speedInput = $('#speed');
  try {
    var animation = new DOMAnimation(initialStateHTML, animationSteps, canvas);
  } catch (err) {
    console.warn(`Error when initializing animation: ${err}`);
  }
  try {
    $playPauseButton.on('click', () => {
      if(animation.isPaused()) animation.play($speedInput);
      else animation.pause();
      $playPauseButton.toggleClass("pause");
    });
    $stopButton.on('click', () => {
      animation.stop();
      $playPauseButton.removeClass("pause");
      $('#model-answer-to-beginning').click();
    });
  } catch (err) {
    console.warn(`Error when setting listeners for animation: ${err}`);
  }
}

module.exports = {
  initializeSlideShow,
  initializeAnimation
}
