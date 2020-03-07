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
        break;
      case "state-change":
        try {
          handleStateChange(av, step)
        } catch (err) {
          alert(`Error handling state change: ${err.message} \n continuing with execution but shown animation 
          might not respond real submission`)   
        }
        break;
      case "undo": 
      try {
        handleUndo(av, step)
      } catch (err) {
        alert(`Error handling undo: ${err.message} \n continuing with execution but shown animation 
        might not respond real submission`)   
      }
      break;
      case "grade":
        try {
          handleGradeEvent(av, step)
        } catch (err) {
          alert(`Error handling grade event: ${err.message} \n continuing with execution but shown animation 
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

function handleUndo(av, step) {
  av.umsg("Undo", {"color": "red"});
  return handleStateChange(av, step);
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

function handleGradeEvent(av, step)  {
  av.umsg("Animation finished", {"color": "red"});
  Object.keys(step.score).forEach(key => {
    let span = document.createElement('span')
    span.innerText = `${key[0].toUpperCase()}${key.slice(1)}: ${step.score[key]} `
    document.getElementById('scores').appendChild(span)
  })
  av.step();
}

module.exports = {
  setAnimationSteps,
}