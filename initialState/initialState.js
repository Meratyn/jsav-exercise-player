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
