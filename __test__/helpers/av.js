const av = {
  ds: {
    array: createArray
  },
  step: () => console.log("set animation step")
}

function createArray(values, options) {
  return {
    _indices: indices(values),
    _values: [ ...values ],
    options: { ...options },
    highlight: function(i) { this._indices[i].highlighted = true },
    swap: function(i,j) { swap(this._indices, this._values, i, j) },
    unhighlight: function(i) { this._indices[i].highlighted = false },
  }
}

function indices(values) {
  return values.map((v, i) => {
    return { highlighted: false }
  })
}

function swap(indices, values, i, j) {
  const tempValues = values[j]
  const tempIndices = { ...indices[j] }
  values[j] = values[i]
  indices[j] = { ...indices[i] }
  values[i] = tempValues
  indices[i] = { ...tempIndices }
}

module.exports = {
  av
}