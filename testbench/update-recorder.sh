#!/bin/bash

# Note! This assumes that jsav-exercise-recorder repository is cloned into
# the same subdirectory as jsav-exercise-player.

watchify ../../jsav-exercise-recorder/exerciseRecorder.js -o \
OpenDSA/lib/jsav-exercise-recorder-bundle.js
