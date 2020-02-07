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