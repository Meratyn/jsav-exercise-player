"use strict"
const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const rest = require("./rest/rest")

async function initialize() {
  try {
    const submission = await getSingleSubmission()
    if(submission){
      initiateAnimation(submission);
      setListeners();
    } else {
      alert('No animation data received')
    }
  } catch (err) {
    alertAndLog(err)
  }
}

async function getSingleSubmission() {
  try {
    const submissions = await rest.getSubmissions();
    return submissions[submissions.length -1]
  } catch (err) {
    throw err
  }
}

function initiateAnimation(submission) {
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
    throw err
  }
}

function setListeners() {
  $("#play-button").on('click', startAutoAnimation)
  document.onkeydown = function(event) {
    //let n = $('.jsavbackward').length -1
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

const startAutoAnimation = () => {
  let animator = startAnimator()
  $("#play-button").off('click', startAutoAnimation)
  $("#play-button").on('click', () => {
    clearInterval(animator)
    $("#play-button").on('click', startAutoAnimation)
  })
}

const startAnimator = () => {
  return setInterval(myTimer, 1000);
}

const myTimer = () => {
  $('.jsavforward')[0].click();
}


const alertAndLog = (error) => {
  alert(`Error handling animation: ${error.message} \n continuing with execution but shown animation
  might not respond real submission`);
  console.warn(`Error handling animation: ${error.message} \n continuing with execution but shown animation
  might not respond real submission`)
}

initialize();
