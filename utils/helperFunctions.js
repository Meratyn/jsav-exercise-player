const  pako = require('pako');

const inflateBinData = (deflatedBinData) => {
  try{
    var binValue = pako.inflate(deflatedBinData);
  }catch(err){ console.warn('invalid-argument', err) }
  return binValue;
}

function inflateToAscii(buffer) {
  return   new Buffer(inflateBinData(buffer,'binary')).toString('ascii')
}

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
  inflateToAscii,
  getSwappedIndexes,
  isSwap
}
