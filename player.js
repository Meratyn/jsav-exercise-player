// player.js
//
// Main JavaScript file of the JSAV Exercise Player.

const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const studentView = require('./animation/student-answer-view.js');
const modelAnswerView = require('./animation/model-answer-view.js');
const jsonViewer = require('./json-viewer/index');

initialize();

async function initialize() {
  try {
  } catch (err) {
    console.warn(`Failed setting button images: ${err}`);
  }
  try {
    if (submission && Object.keys(submission).length > 0) {
      initializeStudentAnswerView(submission, false);
      initializeModelAnswerView(submission);
      setClickHandlers(submission)
    } else {
      console.warn('No animation data received')
    }
  } catch (err) {
    console.warn(err)
  }
}

function initializeStudentAnswerView(submission, detailed) {
  const initialStateHTML = submission.initialState.animationHTML;
  const animationSteps = getAnimationSteps(submission,detailed);
  const canvases = {
    student: $('#animation-container')[0],
    modelAnswer: $('#model-answer-container')[0]
  }
  canvases.student.innerHTML = initialStateHTML;
  studentView.initializeSlideShow(initialStateHTML, animationSteps, canvases);
  studentView.initializeAnimation(initialStateHTML, animationSteps, canvases);
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
  const canvases = {
    student: $('#model-answer-container')[0],
    modelAnswer: {}
  }
  canvases.student.innerHTML = initialStateHTML;
  modelAnswerView.initializeSlideShow(initialStateHTML, animationSteps, canvases);
  modelAnswerView.initializeAnimation(initialStateHTML, animationSteps, canvases);
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
  $('#compare-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('#detailed-view-button').attr({'disabled': false});
    $('.detailed-view').toggle();
    $('.compare-view').toggle();
    $('.model-answer-view > .view-control').toggle();
    $('#animation-container').html('');
    initializeStudentAnswerView(submission,false);
    initializeModelAnswerView(submission);
  });

  $('#detailed-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('.detailed-view').toggle();
    $('.compare-view').toggle();
    $('.model-answer-view > .view-control').toggle();
    $('#compare-view-button').attr({'disabled': false});
    $('#model-answer-container').html('<h3>Model answer steps visualized during the exercise</h3>');
    $('#animation-container').html('');
    initializeStudentAnswerView(submission,true);
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

function showJaal(submission) {
  const modal = $('#myModal');
  modal.css('display', 'block');
  $('#show-jaal').on('click', () => {
    const htmlToString = $('#html-to-string').prop('checked');
    const modalContent = jsonViewer.jsonToHTML(submission)(true)(htmlToString);
    $("#modal-content").html(modalContent);
    jsonViewer.setClickListeners();
  })
  const close = $('.close');
  close.on('click', () => modal.css('display', 'none'));
}

module.exports = {
  initialize
}
