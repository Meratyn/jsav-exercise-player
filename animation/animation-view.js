const { DOMAnimation } = require('./animation.js');
const { DOMSlideShow } = require('./slideShow.js');

function initializeSlideShow(initialStateHTML, animationSteps, canvas) {
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
    });
  } catch (err) {
    console.warn(`Error when setting listeners for animation: ${err}`);
  }
}

module.exports = {
  initializeSlideShow,
  initializeAnimation
}
