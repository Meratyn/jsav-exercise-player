// const base64 = require('base-64');
const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const dataStructures = require("./dataStructures/dataStructures")
const helpers = require("./utils/helperFunctions.js")
let $ = window.$;

initialize();

async function initialize() {
  try {
    let submission = await getSubmission();
    if(submission && Object.keys(submission).length > 0){
      initiateAnimation(submission);
      setKeyboardListeners();
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
    const url = parsedUrl.searchParams.get("submission");
    const response = await fetch(url)
    const submission = response.json();
    return submission;
  } catch (err) {
    throw new Error(` Failed getting submission from address ${url}: ${err}`)
  }
}


function initiateAnimation(submission) {
  try {

  } catch (err) {
    console.warn(err)
    throw err
  }
}

function setKeyboardListeners() {
  $('#animation-container').click();
  $("#play-button").on('click', startAutoAnimation)
  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37:
        $('#step-backward').click()
        break;
      case 38:
        $('#to-beginning').click()
        break;
      case 39:
        $('#step-forward').click()
        break;
      case 40:
        $('#to-end').click()
        break;
    }
  }
}

function startAutoAnimation() {
  let animator = startAnimator()
  $("#play-button").off('click', startAutoAnimation)
  $('#step-forward').click()
  $("#stop-button").on('click', () => {
    clearInterval(animator)
    $('#to-beginning').click();
    $("#play-button").on('click', startAutoAnimation)
  })
  $("#pause-button").on('click', () => {
    clearInterval(animator)
    $("#play-button").on('click', startAutoAnimation)
  })
}

function startAnimator() {
  return setInterval(timedAction, 1000);
}

function timedAction() {
  $('#step-forward').click();
}

window.initializeAnimation = initialize;
window.resetAnimationData = dataStructures.reset;

module.exports = {
  initialize
}
