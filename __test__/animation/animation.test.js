"use strict"
const { getDataStructure, reset } = require("../../dataStructures/dataStructures")
const { array, addArrayClick, addStateChange } = require("../helpers/response")
const { av } = require("../helpers/av")
const { swap } = require("../helpers/functions")
const initialState = require("../../initialState/initialState")
const animation = require("../../animation/animation")

// const rest = require('../rest/rest')

// jest.mock('../rest/rest')
// rest.getSubmissions.mockImplementation(() => Promise.resolve(response.fake))

// const handleArrayClick = jest.fn( () => console.log('click set'))

describe("animation with one data structure", () => {
  beforeEach( () => {
    reset()
  })

  test("array click", () => {
    const id = array.initialState[0].id
    const currentStep = [0, 1]
    const index = [0, 1]
    addArrayClick(id, currentStep[0], index[0])
    addArrayClick(id, currentStep[0], index[1])
    initialState.setInitialDataStructures(av, array)
    animation.setAnimationSteps(av, array)
    const arr = getDataStructure(id).arr
    
    expect(arr._indices[index[0]].highlighted).toBe(true)
    expect(arr._indices[index[1]].highlighted).toBe(true)
  })

  test("state change", () => {
    initialState.setInitialDataStructures(av, array)
    const id = array.initialState[0].id
    const currentStep = [0, 1]
    const arr = getDataStructure(id).arr
    addStateChange(id, currentStep[0], swap(arr._values, 0, 1))
    addStateChange(id, currentStep[1], swap(swap(arr._values, 0, 1), 2, 3))
    const state =  swap(swap(arr._values, 0, 1), 2, 3)
    animation.setAnimationSteps(av, array)
    
    expect(arr._values).toEqual(state)
  })
})