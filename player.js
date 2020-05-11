const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const animationView = require('./animation/animation-view.js');

// let $ = window.$;

initialize();

async function initialize() {
  try {
  } catch (err) {
    console.warn(`Failed setting buttons images: ${err}`);
  }
  try {
    let submission = await getSubmission();
    if(submission && Object.keys(submission).length > 0){
      const initialStateHTML = submission.initialState.animationHTML;
      const animationSteps = getAnimationSteps(submission,true);
      const canvas = $('#animation-container')[0];
      canvas.innerHTML = initialStateHTML;
      animationView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
      animationView.initializeAnimation(initialStateHTML, animationSteps, canvas);
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
    throw new Error(` Failed getting submission from address ${submissionUrl}: ${err}`)
  }
}

function setClickHandlers(submission) {
  $('#compare-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('#detailed-view-button').attr({'disabled': false});
    $('.import-export').toggle();
  });

  $('#detailed-view-button').on('click', (event) => {
    event.target.toggleAttribute('disabled');
    $('.import-export').toggle();
    $('#compare-view-button').attr({'disabled': false});
  });
  $('#jaal').on('click', () => showJaal(submission));
  $('#export').on('click', () => exportAnimation());
}

function showJaal(submission) {
  const modalContent = JSON.stringify(submission, null, 2);
  useModal(modalContent);
}

function exportAnimation() {
  const iframe = `<iframe src=${window.location.href}</iframe>`
  const modalContent = `Add this iframe to an HTML document to import the animation: \n${iframe}`;
  useModal(modalContent);
}

function getAnimationSteps(submission, showClicks) {
  try {
    var gradableSteps = submission.animation.filter(step => step.type === 'gradeable-step');
    var clickSteps = submission.animation.filter(step => step.type !== 'grade');;
  } catch (err) {
    console.warn(` Failed getting animation steps: ${err}`);
  }
  return showClicks? clickSteps : gradableSteps;
}

function useModal(modalContent) {
  $("#modal-content").text(modalContent);
  const modal = $('#myModal');
  modal.css('display', 'block');
  const close = $('.close');
  close.on('click', () => modal.css('display', 'none'));
}

module.exports = {
  initialize
}
