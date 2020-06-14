// animation-view.js
//
// Binds GUI buttons of the Student's answer view

const { DOMAnimation } = require('./animation.js');
const { DOMSlideShow } = require('./slideShow.js');

function initializeSlideShow(initialStateHTML, animationSteps, canvas) {
  try {
    $('#to-beginning').off('click');
    $('#step-backward').off('click');
    $('#step-forward').off('click');
    $('#to-end').off('click');
  } catch (err) {
    console.warn(`Error when setting listeners for slideshow: ${err}`);
  }
  try {
    var slideShow = new DOMSlideShow(initialStateHTML, animationSteps, canvas);
  } catch (err) {
    console.warn(`Error when initializing slideshow: ${err}`);
  }
  try {
    $('#to-beginning').on('click', () => slideShow.reset());
    $('#step-backward').on('click', () => slideShow.backward());
    $('#step-forward').on('click', () => slideShow.forward());
    $('#to-end').on('click', () => slideShow.toEnd());
  } catch (err) {
    console.warn(`Error when setting listeners for slideshow: ${err}`);
  }
}

function initializeAnimation(initialStateHTML, animationSteps, canvas) {
  const $playPauseButton = $("#play-pause-button");
  const $stopButton = $("#stop-button");
  const $speedInput = $('#speed');
  $playPauseButton.off('click');
  $stopButton.off('click');
  $speedInput.off('click');
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
      $('#to-beginning').click();
    });
  } catch (err) {
    console.warn(`Error when setting listeners for animation: ${err}`);
  }
}

module.exports = {
  initializeSlideShow,
  initializeAnimation
}
