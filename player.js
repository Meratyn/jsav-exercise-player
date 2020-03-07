"use strict"
const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const rest = require("./rest/rest")

async function initialize() {
  const submission = await getSingleSubmission()
  console.log(submission)
  if(submission){
    initiateAnimation(submission);
  } else {
    alert('No animation data received')
  }
}

const getSingleSubmission = async () => {
  const submissions = await rest.getSubmissions()
  return submissions[submissions.length -1]
}

const initiateAnimation = (submission) => {
  new JSAV.utils.Settings($('#settings'));
  var avOptions = {
    title: submission.definitions.options.title
  }
  const initilaHTML = submission.definitions.options.instructions;
  document.getElementById("exercise-instructions").innerHTML = initilaHTML;
  var av = new JSAV($("#jsavcontainer"), avOptions)
  initialState.setInitialDataStructures(av, submission)
  av.displayInit()
  try {
    animation.setAnimationSteps(av, submission)
  } catch (err) {
    alert(`Error handling animation: ${err.message} \n continuing with execution but shown animation 
    might not respond real submission`)   
  }
  av.recorded();
}

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

initialize()

module.exports = {
  initialize
}