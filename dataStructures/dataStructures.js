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
  console.warn('Clearing animation data structures');
  dataStructures.forEach((e) => dataStructures.pop())
}

module.exports = {
  addArray,
  getDataStructure,
  reset
}
