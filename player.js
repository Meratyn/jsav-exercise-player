const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const dataStructures = require("./dataStructures/dataStructures")
const rest = require("./rest/rest")
let $ = window.$;
// let JSAV = window.JSAV;
// let submission = window.submission;

async function initialize(JSAV, submission) {
  try {
    // if(!submission) {
    //   submission = await getSingleSubmission()
    // }
    if(submission && Object.keys(submission).length > 0){
      initiateAnimation(JSAV, submission);
      setListeners();
    } else {
      console.warn('No animation data received')
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

const startAnimator = () => {
  return setInterval(timedAction, 1000);
}

const timedAction = () => {
  $('.jsavforward')[0].click();
}


const alertAndLog = (error) => {
  alert(`Error handling animation: ${error.message} \n continuing with execution but the shown animation
  might not respond real submission`);
  console.warn(`Error handling animation: ${error.message} \n continuing with execution but shown animation
  might not respond real submission`)
}

initialize(window.JSAV, window.submission);

window.initializeAnimation = initialize;
window.resetAnimationData = dataStructures.reset;

module.exports = {
  initialize
}

// let player = {
//   initialize
// }
// export default player;
