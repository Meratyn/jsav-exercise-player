"use strict"
const initialState = require("./initialState/initialState")
const animation = require("./animation/animation")
const rest = require("./rest/rest")

async function initialize() {
  const submission = await getSingleSubmission()
  console.log(submission)
  var avOptions = {
    title: submission.definitions.options.title
  }
  const initilaHTML = submission.definitions.options.instructions
  document.getElementById("exercise-instructions").innerHTML = initilaHTML

  var av = new JSAV($("#jsavcontainer"), avOptions)
  initialState.setInitialDataStructures(av, submission)

  av.displayInit()
  
  try {
    animation.setAnimationSteps(av, submission)
  } catch (err) {
    alert(`Error handling animation: ${err.message} \n continuing with execution but shown animation 
    might not respond real submission`)   
  }

  av.recorded()
}

const getSingleSubmission = async () => {
  const submissions = await rest.getSubmissions()
  return submissions[submissions.length -1]
}

initialize()

module.exports = {
  initialize
}