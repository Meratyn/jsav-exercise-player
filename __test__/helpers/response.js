const array =
  {
    "metadata": {},
    "definitions": {
      "style": {},
      "score": {
        "total": 27,
        "correct": 3,
        "undo": 0,
        "fix": 0,
        "student": 3
      },
      "options": {
        "title": "Insertion Sort",
        "instructions": "Use Insertion Sort to sort the table given below in ascending order. Click on an item to select it and click again on another one to swap these bars."
      }
    },
    "initialState": [
      {
        "type": "array",
        "id": "jsav-d0c9c4b33d0947a89dfde2f2413910eb",
        "values": [
          107,
          13,
          102,
          26,
          103,
          16,
          75,
          55,
          72,
          21
        ],
        "options": {
          "visible": true,
          "autoresize": true,
          "center": true,
          "layout": "bar",
          "indexed": true,
          "template": "<span class=\"jsavvaluebar\"></span><span class=\"jsavvalue\"><span class=\"jsavvaluelabel\">{{value}}</span></span><span class=\"jsavindexlabel\">{{index}}</span>"
        }
      }
    ],
    "animation": [],
    "id": 1
  }

function addArrayClick(id, currentStep, index) {
  array.animation.push({
    "type": "click",
    "tstamp": new Date(),
    currentStep,
    "dataStructureId": id,
    index,
    score: {
      "total": 1,
      "correct": 0,
      "undo": 0,
      "fix": 0,
      "student": 1
    }
  })
}

function addStateChange(id, currentStep, state) {
  array.animation.push({
    "type": "state-change",
    "tstamp": new Date(),
    currentStep,
     "dataStructureId": id,
     state,
     score: {
      "total": 1,
      "correct": 0,
      "undo": 0,
      "fix": 0,
      "student": 1
    }
  })
}

module.exports = {
  array,
  addArrayClick,
  addStateChange
}