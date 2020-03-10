(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const dataStructures = require("../dataStructures/dataStructures")
const { getSwappedIndexes, isSwap } = require("../utils/helperFunctions")
const modelSolution = {
  being: "",
  end: "",
  stepsForward: [],
  stepsBackward: [],
}

function setAnimationSteps(av, submission) {
  setMutationObserver($('.jsavoutput')[0]);
  submission.animation.forEach(step => {
    switch(step.type) {
      case "click":
        try {
          handleClick(av, step)
        } catch (err) {
          console.warn(`Error handling click action: ${err.message} \n continuing with execution but shown animation
          might not respond real submission`)
        }
        break;
      case String(step.type.match(/^model-.*/)):
        try {
          handleModelSolution(av, step)
        } catch (err) {
          console.warn(`Error when openening model solution window: ${err}`)
        }
        break;
      case "state-change":
        try {
          handleStateChange(av, step)
        } catch (err) {
          console.warn(`Error handling state change: ${err.message} \n continuing with execution but shown animation
          might not respond real submission`)
        }
        break;
      case "undo":
      try {
        handleUndo(av, step)
      } catch (err) {
        console.warn(`Error handling undo: ${err.message} \n continuing with execution but shown animation
        might not respond real submission`)
      }
      break;
      case "grade":
        try {
          handleGradeEvent(av, step)
        } catch (err) {
          console.warn(`Error handling grade event: ${err.message} \n continuing with execution but shown animation
          might not respond real submission`)
        }
        break;
      default:
        throw new Error(`Unknown animation step type: ${JSON.stringify(step)}`)
    }
  })
}

function handleClick(av, step) {
  const dataStructure = dataStructures.getDataStructure(step.dataStructureId)
  switch(dataStructure.type) {
    case "array":
      handleArrayClick(av,dataStructure, step)
      break
    default:
      throw new Error(`Unknown data structure type: ${JSON.stringify(step)}`)
    }
}

function handleArrayClick(av, dataStructure, step) {
  dataStructure.arr.highlight(step.index)
  av.step()
}

function handleArrayStateChange(av, dataStructure, step) {
  const oldState = dataStructure.arr._values
  const newState = step.state
  const stateChangeType = getArrayStateChangeType(oldState, newState)
  switch(stateChangeType) {
    case "swap":
      const [ i, j ] = getSwappedIndexes(oldState, newState)
      dataStructure.arr.swap(i, j)
      dataStructure.arr.unhighlight(i)
      dataStructure.arr.unhighlight(j)
      av.step();
      av.clearumsg();
      break
    default:
      dataStructure.arr.unhighlight()
      throw new Error(`Unknown state change type: ${stateChangeType}`)
  }
}

function getArrayStateChangeType(oldState, newState) {
  if(isSwap(oldState, newState)){
    return "swap"
  }
  return `Old state: ${oldState} \n New statea: ${newState}`
}

function handleModelSolution(av, step) {
  switch(step.type) {
    case "model-recorded":
      modelSolution.begin = step.state;
      av.umsg("Model solution opened", {"color": "blue"});
      av.step();
      break;
    case "model-forward":
      modelSolution.stepsForward.push(step.state)
      av.umsg(`Model solution forward ${modelSolution.stepsForward.length}`, {"color": "blue"});
      av.step();
      break;
    case "model-backward":
      modelSolution.stepsBackward.push(step.state)
      av.umsg(`Model solution backward ${modelSolution.stepsBackward.length}`, {"color": "blue"});
      av.step();
      break;
    case "model-begin":
      av.umsg(`Model solution to first step`, {"color": "blue"});
      av.step();
      break;
    case "model-end":
      modelSolution.end = step.state;
      av.umsg(`Model solution to last step`, {"color": "blue"});
      av.step();
      break;
    case "model-close":
      av.umsg(`Model solution closed`, {"color": "blue"});
      av.step();
      break;
    default:

  }
}

function handleGradeEvent(av, step)  {
  av.umsg("Animation finished", {"color": "red"});
  Object.keys(step.score).forEach(key => {
    let span = document.createElement('span')
    span.innerText = `${key[0].toUpperCase()}${key.slice(1)}: ${step.score[key]} `
    document.getElementById('scores').appendChild(span)
  })
  av.step();
}

function handleStateChange(av, step) {
  const dataStructure = dataStructures.getDataStructure(step.dataStructureId)
  switch(dataStructure.type) {
    case "array":
      try {
        handleArrayStateChange(av,dataStructure, step)
      } catch (err) {
        console.warn(`Error handling array state change: ${err.message} \n continuing with execution but shown animation
        might not respond real submission`)
      }
      break
    default:
      throw new Error(`Unknown data structure type: ${JSON.stringify(step)}`)
  }
}

function handleUndo(av, step) {
  av.umsg("Undo", {"color": "red"});
  return handleStateChange(av, step);
}

//We need it to set the content of the model solution div
const setMutationObserver = (targetNode) => {
  let msIndex;
  const callback = function(mutationsList, observer) {
    let text;
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if(mutation.target) {
          if(mutation.target.firstChild) {
            if(mutation.target.firstChild.innerText) {
              text = mutation.target.firstChild.innerText;
            }
          }
        }
        switch(text) {
          case "Model solution opened":
            msIndex = 0;
            $('#model-solution')[0].innerHTML = modelSolution.begin
            break;
          case String(text.match(/.*forward.*\d*/)):
            msIndex = parseInt(String(text.match(/\d+/))) -1;
            $('#model-solution')[0].innerHTML = modelSolution.stepsForward[msIndex]
            break;
          case String(text.match(/.*backward.*\d*/)):
            msIndex = parseInt(String(text.match(/\d+/))) -1;
            $('#model-solution')[0].innerHTML = modelSolution.stepsBackward[msIndex]
            break;
          case String(text.match(/.*first step/)):
            $('#model-solution')[0].innerHTML = modelSolution.begin
            break;
          case String(text.match(/.*last step/)):
            $('#model-solution')[0].innerHTML = modelSolution.end;
            break;
          case "Model solution closed":
            $('#model-solution')[0].innerHTML = "";
            break;
          default:
            $('#model-solution')[0].innerHTML = "";
            break;
        }
      }
    }
  }
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}


module.exports = {
  setAnimationSteps,
}

},{"../dataStructures/dataStructures":2,"../utils/helperFunctions":6}],2:[function(require,module,exports){
const dataStructures = []

function addArray(submissionId, arr) {
  dataStructures.push({ 
    type: "array",
    submissionId, 
    arr })
}

function getDataStructure(submissionId) {
  return dataStructures.find(ds => ds.submissionId === submissionId)
}

function reset() {
  dataStructures.forEach((e) => dataStructures.pop())
}

module.exports = {
  addArray,
  getDataStructure,
  reset
}

},{}],3:[function(require,module,exports){
const dataStructures = require("../dataStructures/dataStructures")

function setInitialDataStructures (av, submission) {
  submission.initialState.forEach(ds => {
    switch (ds.type) {
      case "array":
        setArray(av, ds)
        break
      // TODO cases for other ds types
      default:
        throw new Error(`Submission contains unknown data structure type: ${ds}`)
    }
  })
}

function setArray (av, arrayDs) {
  const arr = av.ds.array(arrayDs.values, arrayDs.options)
  dataStructures.addArray(arrayDs.id,arr)
}

module.exports = {
  setInitialDataStructures
}

},{"../dataStructures/dataStructures":2}],4:[function(require,module,exports){
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


initialize()

module.exports = {
  initialize
}

},{"./animation/animation":1,"./initialState/initialState":3,"./rest/rest":5}],5:[function(require,module,exports){
const server = "http://localhost:3000/submissions"

async function getSubmissions () {  
  const response = await fetch(server)
  return response.json()
}

const rest = { getSubmissions }

module.exports = rest

},{}],6:[function(require,module,exports){
function getSwappedIndexes(oldState, newState) {
  const swappedIndices = []
  newState.forEach((v,i) => {
    if(oldState[i] !== v) {
      swappedIndices.push(i)
    }
  })  
  return isSwap(oldState, newState) && swappedIndices
}

function isSwap(oldState, newState) {
  const changedValues = oldState.filter((v,i) => {
    return newState[i] !== v
  })
  const newIndices = changedValues.map(v => newState.indexOf(v))
  return changedValues.length === 2 && newIndices.indexOf(-1) === -1
}

module.exports = {
  getSwappedIndexes,
  isSwap
}
},{}]},{},[4]);
