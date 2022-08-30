#!/bin/bash

# Assumption: testbench/OpenDSA/lib/jsav-exercise-player-bundle.js is a
# symbolic link to build/jsav-exercise-player-bundle.js.

watchify ../player.js -o build/jsav-exercise-player-bundle.js
