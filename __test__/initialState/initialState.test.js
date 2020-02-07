"use strict"
const { getDataStructure, reset } = require("../../dataStructures/dataStructures")
const response = require("../helpers/response")
const { av } = require("../helpers/av")
const initialState = require("../../initialState/initialState")

describe("initial state with one data structure", () => {
  beforeEach( () => {
    reset()
  })

  test("single array set correctly", () => {
    initialState.setInitialDataStructures(av, response.array)
    const submittedInitialState = response.array.initialState
    const expectedDataStructure = {
      type: "array",
      submissionId: submittedInitialState[0].id, 
      arr: { 
        _values: [ ...submittedInitialState[0].values ], 
        options: { ...submittedInitialState[0].options },
      }
    }
    const dataStructure = getDataStructure(submittedInitialState[0].id)
    expect(dataStructure.type).toEqual(expectedDataStructure.type)
    expect(dataStructure.submissionId).toEqual(expectedDataStructure.submissionId)
    expect(dataStructure.arr.values).toEqual(expectedDataStructure.arr.values)
    expect(dataStructure.arr.options).toEqual(expectedDataStructure.arr.options)
  })
})