// player.js
//
// Main JavaScript file of the JSAV Exercise Player.

const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const animationView = require('./animation/animation-view.js');
const modelAnswerView = require('./animation/model-answer-view.js');
const jsonViewer = require('./json-viewer/index');
const version = require('./utils/version');

// HTML Entity encoder/decoder library. https://github.com/mathiasbynens/he
const he = require('he');

// Variable to keep track of whether the handlers have been set yet or not. 
var handlersSet = false;

let modalPositioned = false;

initialize();

function parseEscapedRecording() {
  // 1. Convert from Base64 to string
  const decoded = atob(global.JAALrecording);
  // 2. Unescape HTML entities
  const unescaped = he.decode(decoded);
  // 3. Parse the string as JSON
  const parsed = JSON.parse(unescaped);
  return parsed;
}

async function initialize() {
  console.log("Player main initialization function")
  try {
  } catch (err) {
    console.warn(`Failed setting button images: ${err}`);
  }
  try {
    // JAAL 1.0 A+ LMS setup: JAAL recording is embedded on the web page
    // as global variable JAALrecording.
    if (globalThis.JAALrecording &&
        Object.keys(globalThis.JAALrecording).length > 0)
    {
      let submission = parseEscapedRecording();
      loadJsonSubmission(null, submission);
    } else {
      // Assume test bench built on static web page without A+ LMS.
      console.log('No animation data received. Assuming test bench.');
      $("body").on("jsav-exercise-recorder-test-submit",
        loadJsonSubmission);
    }
  } catch (err) {
    console.warn(err)
  }
}

/*
 * Loads JAAL data as a JavaScript object into the JSAV Exercise Player.
 *
 * Parameters:
 * event: a browser event
 * submission: the JAAL data as a JavaScript object
 *
 * Parameter "event" is used if loadSubmission called on a browser event.
 */
function loadJsonSubmission(event, submission) {
  console.log("Loading submission.")
  if (submission === undefined) {
    console.error("No JAAL submission found!");
    return
  }
  console.log("Metadata of JAAL submission: ", submission['metadata']);

  const recVersion = submission['metadata']['jaalVersion'];
  if (recVersion == version) {
    console.log("JAAL Recorder and Player versions match, good! Version is",
    version)
  }
  else {
    console.warn("JAAL Recorder version is", recVersion,
      ", but Player version is", version, ". Something might break.");
  }
  initializeAnimationView(submission, false);
  initializeModelAnswerView(submission);
  if (!handlersSet) {
    setClickHandlers(submission);
  }
}

/**
 * Initialise the animation view of the student steps. 
 * Get the initial state and the model steps, 
 * then initialise the animation and slide show. 
 * @param submission JSON submission data
 * @param detailed boolean to indicate whether to get the 
 * detailed or the condensed animation steps. 
 */
function initializeAnimationView(submission, detailed) {
  const initialStateHTML = submission.initialState.svg;
  const animationSteps = getAnimationSteps(submission,detailed);
  const canvas = {
    animationCanvas: $('#animation-container')[0],
    modelAnswerCanvas: $('#model-answer-container')[0]
  }
  canvas.animationCanvas.innerHTML = initialStateHTML;
  animationView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
  animationView.initializeAnimation(initialStateHTML, animationSteps, canvas);
}

/**
 * Initialise the model answer view. Get the model answer steps with svg data, 
 * and the initial state. Initialise the slide show and the animation. 
 * @param submission JSON submission data
 */
function initializeModelAnswerView(submission) {
  const modelAnswer = submission.definitions.modelAnswer;
  if (modelAnswer.length > 0) {
    var initialStateHTML = submission.initialState.modelSvg;
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

/**
 * Get the animation steps from the submission, optionally filtered for only
 * those of type click. 
 * @param submission JSON of the submission in JAAL 1.1
 * @param detailed boolean to indicate whether the full list of steps is 
 * wanted or only the ones with clicks. 
 * @returns all the steps in the detailed case, 
 *  otherwise only the steps with clicks
 */
function getAnimationSteps(submission, detailed) {
  try {
    var gradableSteps = submission.animation.filter(step => step.type === 'click');
    var allSteps = submission.animation.filter(step => !step.type.includes('grad'));;
  } catch (err) {
    console.warn(`Failed getting animation steps: ${err}`);
  }
  return detailed? allSteps : gradableSteps;
}

/**
 * Get the initial state of the model Answer, which is stored at index 1. 
 * @param modelAnswer list containing all the model answer steps
 * @returns svg if it is present, otherwise undefined
 */
function getModelAnswerInitialHTML(modelAnswer) {
  return ((modelAnswer.length > 1) ? modelAnswer[1].svg : undefined);
}

/**
 * Filter the modelAnswer to get only the steps that have the type click. 
 * @param modelAnswer list of modelAnswer steps 
 * @returns a list of the modelAnswer steps with type click. 
 */
function getModelAnswerSteps(modelAnswer) {
  modelAnswer = modelAnswer.flat();
  return modelAnswer.filter(step => step.gradable === true);
}

/**
 * Set the click handlers for the buttons on the page. 
 * @param submission JAAL 1.1 submission data
 */
function setClickHandlers(submission) {
  handlersSet = true;
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
    $('#model-answer-container').html('<h3>Model answer steps visualised during the exercise</h3>');
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
