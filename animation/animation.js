let $ = window.$;

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
        handleArrayStateChange(av, dataStructure, step)
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
        if(text){
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
            case "Animation finished":
              let stopButton = $('#pause-button')[0]
              if(stopButton) {
                stopButton.click();
              }
              break;
            default:
              $('#model-solution')[0].innerHTML = "";
              break;
          }
        }
      }
    }
  }
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// export default {
//   setAnimationSteps
// }

module.exports = {
  setAnimationSteps,
}
