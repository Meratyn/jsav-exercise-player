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
    if (globalThis.JAALrecording && Object.keys(globalThis.JAALrecording).length > 0) {
      let submission = global.JAALrecording;
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

// Toggles main Player modal on/off.
function togglePlayer() {
  var jaalModal = $('#jaalPlayerModal');
  if (jaalModal.css('display') === 'none') {

    /* A+ LMS inserts an attribute "data-view-tag" in the <body> element
     * depending on which Django view (page type) it is showing. */
    switch($('body').attr('data-view-tag')) {
      case "exercise":
        /* Student's view of exercise.
         * A+ LMS source code:
         *   Repository: https://github.com/apluslms/a-plus/
         *   File: exercise/templates/exercise/exercise.html */
        showPlayerInExerciseView(jaalModal);
        break;

      case "inspect":
        /* Course staff's or administrator's "Inspect submission" view.
         * A+ LMS source code:
         *   Repository: https://github.com/apluslms/a-plus/
         *   File: exercise/templates/exercise/staff/inspect_submission.html */
        showPlayerInInspectView(jaalModal);
        break;
    }
  }
  else {
    jaalModal.css('display', 'none');
  }
}

// Shows JSAV Player modal in the Exercise View of A+ LMS.
function showPlayerInExerciseView(jaalModal) {
  /* Assumption: the exercise recording and HTML references to the JSAV
   * Exercise player are placed in A+ LMS like this:
   * <div class="modal-content">
   *   <div class="exercise-content">
   *     <-- Code from templates/player-body.html -->
   *     <div id="jaalPlayerModal" class="jaalModalContent">
   *     </div>
   *   </div>
   * </div>
   * The CSS class "modal-content" is from the Bootstrap library
   * (http://getbootstrap.com). Even if the CSS for #jaalPlayerModal is:
   *   { position: fixed; top: 30px; left: 30px; }
   * the browser positions #jaalPlayerModal relative to .modal-content,
   * not the browser window! Therefore the fixed position of #jaalPlayerModal
   * must be recomputed when the modal is shown. This is what the code below
   * does.
   */
   jaalModal.css('display', 'block');
   jaalModal.css('overflow', 'visible');
   jaalModal.css('height', 'auto');
   var aplusModal = $('.modal-content');
   var offset = jaalModal.offset();
   offset.left -= 0.5 * (jaalModal.width() - aplusModal.width());
   offset.top -= 30;
   jaalModal.offset(offset);
}

// Shows JSAV Player modal in the Inspect Submission View of A+ LMS.
function showPlayerInInspectView(jaalModal) {
  jaalModal.css('display', 'block');
  /* Here the JSAV Player modal is used without a Bootstrap modal.
   * FIXME: the overflow and height must be set, because the Player modal
   * doesn't scroll with the window. This is unfortunate. */
  jaalModal.css('overflow', 'scroll');
  jaalModal.css('height', '900px');
  const body = $('body');
  const topbar = $('nav.topbar');
  var offset = jaalModal.offset();
  offset.left += 0.5 * (body.width() - jaalModal.width());
  offset.top += topbar.height();
  jaalModal.offset(offset);
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
