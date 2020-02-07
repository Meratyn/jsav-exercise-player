(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const dataStructures = require("../dataStructures/dataStructures")
const { getSwappedIndexes, isSwap } = require("../utils/helperFunctions")

function setAnimationSteps(av, submission) {
  submission.animation.forEach(step => {    
    switch(step.type) {
      case "click":
        try {
          handleClick(av, step)
        } catch (err) {
          alert(`Error handling click action: ${err.message} \n continuing with execution but shown animation 
          might not respond real submission`)   
        }
        break
      case "state-change":
        try {
          handleStateChange(av, step)
        } catch (err) {
          alert(`Error handling state change: ${err.message} \n continuing with execution but shown animation 
          might not respond real submission`)   
        }
        break
      case "grade":
        try {
          handleGradeEvent(av, step)
        } catch (err) {
          alert(`Error handling grade event: ${err.message} \n continuing with execution but shown animation 
          might not respond real submission`)
        }
        break
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

function handleStateChange(av, step) {
  const dataStructure = dataStructures.getDataStructure(step.dataStructureId)  
  switch(dataStructure.type) {
    case "array":
      try {
        handleArrayStateChange(av,dataStructure, step)
      } catch (err) {
        alert(`Error handling array state change: ${err.message} \n continuing with execution but shown animation 
        might not respond real submission`)
      }
      break
    default:
      throw new Error(`Unknown data structure type: ${JSON.stringify(step)}`)
  }
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
      av.step()
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

function handleGradeEvent(av, step)  {
  av.umsg("Animation finished", {"color": "blue"});
  Object.keys(step.score).forEach(key => {
    let span = document.createElement('span')
    span.innerText = `${key[0].toUpperCase()}${key.slice(1)}: ${step.score[key]} `
    document.getElementById('scores').appendChild(span)
  })
  av.step()
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
