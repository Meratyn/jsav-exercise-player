// const base64 = require('base-64');
const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const dataStructures = require("./dataStructures/dataStructures")
const helpers = require("./utils/helperFunctions.js")
const env = require('./.env.js');
let $ = window.$;

initialize(window.JSAV);

async function initialize(JSAV) {
  try {
    // let deflatedData = window.location.search.replace('?submission=', '');
    // let buffer;
    // try { buffer = Buffer.from(deflatedData, 'base64') }
    // catch(err) { console.warn(err) }
    // let submission = JSON.parse(helpers.inflateToAscii(buffer));
    let submission = await getSubmission();
    if(submission && Object.keys(submission).length > 0){
      initiateAnimation(JSAV, submission);
      setListeners();
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


function initiateAnimation(JSAV, submission) {
  try {
    new JSAV.utils.Settings($('#settings'));
    const instructions = submission.definitions.options.instructions;
    const title = submission.definitions.options.title
    $("#exercise-instructions").innerHTML = instructions;
    let av = new JSAV($("#jsavcontainer"), { title: title })
    initialState.setInitialDataStructures(av, submission)
    av.displayInit();
    animation.setAnimationSteps(av, submission)
    av.recorded();
  } catch (err) {
    console.warn(err)
    throw err
  }
}

function setListeners() {
  $('#jsavcontainer').click();
  $("#play-button").on('click', startAutoAnimation)
  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37:
        $('.jsavbackward')[0].click()
        break;
      case 38:
        $('.jsavbegin')[0].click()
        break;
      case 39:
        $('.jsavforward')[0].click()
        break;
      case 40:
        $('.jsavend')[0].click()
        break;
    }
  }
}

function startAutoAnimation() {
  let animator = startAnimator()
  $("#play-button").off('click', startAutoAnimation)
  $('.jsavforward')[0].click()
  $("#stop-button").on('click', () => {
    clearInterval(animator)
    $('.jsavbegin')[0].click();
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
  $('.jsavforward')[0].click();
}

window.initializeAnimation = initialize;
window.resetAnimationData = dataStructures.reset;

module.exports = {
  initialize
}
