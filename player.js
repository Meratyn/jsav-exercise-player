// player.js
//
// Main JavaScript file of the JSAV Exercise Player.

const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const animationView = require('./animation/animation-view.js');
const modelAnswerView = require('./animation/model-answer-view.js');
const jsonViewer = require('./json-viewer/index');

let modalPositioned = false;

initialize();

async function initialize() {
  try {
  } catch (err) {
    console.warn(`Failed setting button images: ${err}`);
  }
  try {
    if (submission && Object.keys(submission).length > 0) {
      initializeAnimationView(submission, false);
      initializeModelAnswerView(submission);
      setClickHandlers(submission)
    } else {
      console.warn('No animation data received')
    }
  } catch (err) {
    console.warn(err)
  }
}

function initializeAnimationView(submission, detailed) {
  const initialStateHTML = submission.initialState.animationHTML;
  const animationSteps = getAnimationSteps(submission,detailed);
  const canvas = {
    animationCanvas: $('#animation-container')[0],
    modelAnswerCanvas: $('#model-answer-container')[0]
  }
  canvas.animationCanvas.innerHTML = initialStateHTML;
  animationView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
  animationView.initializeAnimation(initialStateHTML, animationSteps, canvas);
}

function initializeModelAnswerView(submission) {
  const modelAnswer = submission.definitions.modelAnswer;
  if (modelAnswer.steps.length > 0) {
      var initialStateHTML = getModelAnswerInitialHTML(modelAnswer);
  } else {
    $('#model-answer-container').html('<h3>No model answer data</h3>');
    return;
  }
  const animationSteps = getModelAnswerSteps(modelAnswer);
  const canvas = {
    animationCanvas: $('#model-answer-container')[0],
    modelAnswerCanvas: {}
  }
  canvas.animationCanvas.innerHTML = initialStateHTML;
  modelAnswerView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
  modelAnswerView.initializeAnimation(initialStateHTML, animationSteps, canvas);
}

function getAnimationSteps(submission, detailed) {
  try {
    var gradableSteps = submission.animation.filter(step => step.type === 'gradeable-step');
    var allSteps = submission.animation.filter(step => !step.type.includes('grad'));;
  } catch (err) {
    console.warn(`Failed getting animation steps: ${err}`);
  }
  return detailed? allSteps : gradableSteps;
}

function getModelAnswerInitialHTML(modelAnswer) {
  const counterHTML = modelAnswer.steps[0].html.counterHTML;
  const outputHTML = modelAnswer.steps[0].html.outputHTML;
  const canvasHTML = modelAnswer.steps[0].html.canvasHTML;
  return counterHTML + outputHTML + canvasHTML;
}

function getModelAnswerSteps(modelAnswer) {
  const animationSteps = modelAnswer.steps.map((step, i) => {
    animationHTML = step.html.counterHTML + step.html.outputHTML + step.html.canvasHTML;
    return { type: '', animationHTML };
  });
  animationSteps.shift();
  return animationSteps;
}

function setClickHandlers(submission) {
  $('#show-player').click(togglePlayer);
  $('#close-player-modal').click(togglePlayer);

  $('#compare-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('#detailed-view-button').attr({'disabled': false});
    $('.detailed-view').toggle();
    $('.compare-view').toggle();
    $('.model-answer-view > .view-control').toggle();
    $('#animation-container').html('');
    initializeAnimationView(submission,false);
    initializeModelAnswerView(submission);
  });

  $('#detailed-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('.detailed-view').toggle();
    $('.compare-view').toggle();
    $('.model-answer-view > .view-control').toggle();
    $('#compare-view-button').attr({'disabled': false});
    $('#model-answer-container').html('<h3>Model answer steps visulized during the exercise</h3>');
    $('#animation-container').html('');
    initializeAnimationView(submission,true);
  });

  $('#compare-view-to-beginning').on('click', () => {
    $('#to-beginning').click();
    $('#model-answer-to-beginning').click();
  });
  $('#compare-view-step-backward').on('click', () => {
    $('#step-backward').click();
    $('#model-answer-step-backward').click();
  });
  $('#compare-view-step-forward').on('click', () => {
    $('#step-forward').click();
    $('#model-answer-step-forward').click();
  });
  $('#compare-view-to-end').on('click', () => {
    $('#to-end').click();
    $('#model-answer-to-end').click();
  });

  $('#compare-view-play-pause-button').on('click', () => {
    $('#play-pause-button').click();
    $('#model-answer-play-pause-button').click();
  });
  $('#compare-view-stop-button').on('click', () => {
    $('#stop-button').click();
    $('#model-answer-stop-button').click();
  });

  $('#jaal').on('click', () => showJaal(submission));
  $('#export').on('click', () => exportAnimation());
}

function exportAnimation() {
  const iframe = `<iframe src=${window.location.href}</iframe>`
  const modalContent = `Add this iframe to an HTML document to import the animation: \n${iframe}`;
  useModal(modalContent);
}

// Toggles main Player modal on/off
function togglePlayer() {
  const modal = $('#jaalPlayerModal');
  if (modal.css('display') === 'none') {

    modal.css('display', 'block');
    const desiredOffset = 30; // pixels
    const widthSettings = fitInnerMeasure($('html').innerWidth(),
      modal.innerWidth(), desiredOffset);

    const heightSettings = fitInnerMeasure($('html').innerHeight(),
      modal.innerHeight(), desiredOffset);
    
    modal.offset({top: heightSettings.offset, left: widthSettings.offset});
    modal.css('height', heightSettings.measure);
    modal.css('width', widthSettings.measure);
  }
  else {
    modal.css('display', 'none');
  }
}

// Helper function for fitting a modal box inside page display area
function fitInnerMeasure(pageMeasure, modalMeasure, desiredOffset) {
  let result = { offset: 0, measure: 0 };
  if (modalMeasure < pageMeasure) {
    result.offset = Math.max((pageMeasure - modalMeasure) / 2, desiredOffset);
    result.measure = modalMeasure;
  }
  else {
    result.measure = pageMeasure;
  }
  return result;
}

// Shows JAAL tree modal
function showJaal(submission) {
  const modal = $('#jaalTreeModal');
  modal.css('display', 'block');
  $('#show-jaal').on('click', () => {
    const htmlToString = $('#html-to-string').prop('checked');
    const modalContent = jsonViewer.jsonToHTML(submission)(true)(htmlToString);
    $("#jaalTreeContent").html(modalContent);
    jsonViewer.setClickListeners();
  })
  const close = $('#jaalTreeModal-close');
  close.on('click', () => modal.css('display', 'none'));
}

module.exports = {
  initialize
}
