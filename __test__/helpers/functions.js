function swap(array, i, j){
  const newArray = [ ...array ]
  newArray[j] = array[i]
  newArray[i] = array[j]
  return newArray
}

module.exports = {
  swap
}