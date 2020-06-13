const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const animationView = require('./animation/animation-view.js');
const modelAnswerView = require('./animation/model-answer-view.js');
const jsonViewer = require('./json-viewer/index');

initialize();

async function initialize() {
  try {
  } catch (err) {
    console.warn(`Failed setting button images: ${err}`);
  }
  try {
    // let submission = await getSubmission();
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

async function getSubmission() {
  try {
    const parsedUrl = new URL(window.location.href);
    const submissionUrl = parsedUrl.searchParams.get("submission");
    const response = await fetch(submissionUrl)
    const submission = response.json();
    return submission;
  } catch (err) {
    throw new Error(`Failed getting submission from address ${submissionUrl}: ${err}`)
  }
}

function initializeAnimationView(submission, detailed) {
  const initialStateHTML = submission.initialState.animationHTML;
  const animationSteps = getAnimationSteps(submission,detailed);
  const canvas = {
    animationCanvas: $('#animation-container')[0],
    modelAnswerCanvas: $('#model-answer-container')[0]
  }
  const stepDisplay = $('#student-step-number');
  canvas.animationCanvas.innerHTML = initialStateHTML;
  animationView.initializeSlideShow(initialStateHTML, animationSteps, canvas,
    stepDisplay);
  animationView.initializeAnimation(initialStateHTML, animationSteps, canvas,
    stepDisplay);
}

function initializeModelAnswerView(submission) {
  const modelAnswer = submission.definitions.modelAnswer;
  if (modelAnswer.steps.length > 0) {
      var initialStateHTML = getModelAnserInitialHTML(modelAnswer);
  } else {
    $('#model-answer-container').html('<h3>No model answer data</h3>');
    return;
  }
  const animationSteps = getModelAnswerSteps(modelAnswer);
  const canvas = {
    animationCanvas: $('#model-answer-container')[0],
    modelAnswerCanvas: {}
  }
  const stepDisplay = $('#model-step-number');
  canvas.animationCanvas.innerHTML = initialStateHTML;
  modelAnswerView.initializeSlideShow(initialStateHTML, animationSteps, canvas,
    stepDisplay);
  modelAnswerView.initializeAnimation(initialStateHTML, animationSteps, canvas,
    stepDisplay);
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

function getModelAnserInitialHTML(modelAnswer) {
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

  $('#about-button').on('click', showAboutDialog);

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
  const modal = $('#jaalTreeModal');
  modal.css('display', 'block');
  $('#show-jaal').on('click', () => {
    const htmlToString = $('#html-to-string').prop('checked');
    const modalContent = jsonViewer.jsonToHTML(submission)(true)(htmlToString);
    $("#modal-content").html(modalContent);
    jsonViewer.setClickListeners();
  })
  const closeButton = $('#jaalTreeModal-close');
  closeButton.on('click', () => modal.css('display', 'none'));
}

function showAboutDialog() {
  const aboutText = "JSAV Exercise Player 1.0.1\n\n" +
  "Giacomo Mariani and Artturi Tilanterä, 2020\n\n" +
  "https://github.com/MarianiGiacomo/jsav-exercise-player\n" +
  "https://aaltodoc.aalto.fi/handle/123456789/44448\n" +
  "https://research.cs.aalto.fi/LeTech/ <b>jee</b>";

  window.alert(aboutText);
}

module.exports = {
  initialize
}
