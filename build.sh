#!/bin/bash

browserify player.js > build/jsav-exercise-player-bundle.js

cp test/test-header.html test/standalone-player.html
cat player-body.html >> test/standalone-player.html
cat test/test-footer.html >> test/standalone-player.html
