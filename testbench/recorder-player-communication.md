# How the Recorder and Player communicate in the test bench

1. User clicks the Submit button.

2. odsaAV-min.js : sendSubmission generates a browser event to notify the
   Player. Event type is "jsav-exercise-recorder-test-submit", event data
   is the JAAL recording without escaping.

3. When the JSAV Exercise Player starts, it assumes it is inside test bench
   if there is no global variable "JAALrecording" present. It starts to listen
   events of type "jsav-exercise-recorder-test-submit".

4. On event "jsav-exercise-recorder-test-submit", JSAV Exercise Player
   runs the function loadJsonSubmission().
