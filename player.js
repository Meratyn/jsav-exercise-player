const { DOMAnimation } = require('./animation/animation.js');
const { DOMSlideShow } = require('./animation/slideShow.js');
const animationView = require('./animation/animation-view.js');
const modelAnswerView = require('./animation/model-answer-view.js');

initialize();

async function initialize() {
  try {
  } catch (err) {
    console.warn(`Failed setting buttons images: ${err}`);
  }
  try {
    let submission = await getSubmission();
    if(submission && Object.keys(submission).length > 0){
      setStyles(submission);
      initializeAnimationView(submission, false);
      initializeModelAnswerView(submission);
      setClickHandlers(submission)
    } else {
      setClickHandlers(submission)
			$(".no-data").text('No animation data received')
		}
  } catch (err) {
    console.warn(err)
  }
}

async function getSubmission() {
  try {
    const parsedUrl = new URL(window.location.href);
    const submissionUrl = parsedUrl.searchParams.get("submission");
		if(submissionUrl) {
			const response = await fetch(submissionUrl)
			const submission = response.json();
			return submission;
		}
  } catch (err) {
    throw new Error(`Failed getting submission from address ${submissionUrl}: ${err}`)
  }
}

function setStyles(submission) {
  submission.definitions.styles.forEach((item, i) => {
    $(`<style>${item}</style>`).appendTo('body');
  });
}

function initializeAnimationView(submission, detailed) {
  const initialStateHTML = submission.initialState.animationHTML;
	const displayScore = `${submission.definitions.score.correct}/${submission.definitions.score.total}`;
	$(".score").text(`Score ${displayScore}`);
  const animationSteps = getAnimationSteps(submission,detailed);
  const canvas = {
    animationCanvas: $('#animation-container')[0],
    modelAnswerCanvas: $('#model-answer-container')[0]
  }
  canvas.animationCanvas.innerHTML = initialStateHTML;
  animationView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
  animationView.initializeAnimation(initialStateHTML, animationSteps, canvas);
}

function initializeModelAnswerView(submission) {
  const modelAnswer = submission.definitions.modelAnswer;
  if (modelAnswer.steps.length > 0) {
      var initialStateHTML = getModelAnserInitialHTML(modelAnswer);
  } else {
    $('#model-answer-container').html('<h3>No model answer data</h3>');
    return;
  }
  const animationSteps = getModelAnswerSteps(modelAnswer);
  const canvas = {
    animationCanvas: $('#model-answer-container')[0],
    modelAnswerCanvas: {}
  }
  canvas.animationCanvas.innerHTML = initialStateHTML;
  modelAnswerView.initializeSlideShow(initialStateHTML, animationSteps, canvas);
  modelAnswerView.initializeAnimation(initialStateHTML, animationSteps, canvas);
}

function getAnimationSteps(submission, detailed) {
  try {
    var gradableSteps = submission.animation.filter(step => step.type === 'gradeable-step');
    var allSteps = submission.animation.filter(step => !step.type.includes('grad'));;
  } catch (err) {
    console.warn(`Failed getting animation steps: ${err}`);
  }
  return detailed? allSteps : gradableSteps;
}

function getModelAnserInitialHTML(modelAnswer) {
  const counterHTML = modelAnswer.steps[0].html.counterHTML;
  const outputHTML = modelAnswer.steps[0].html.outputHTML;
  const canvasHTML = modelAnswer.steps[0].html.canvasHTML;
  return counterHTML + outputHTML + canvasHTML;
}

function getModelAnswerSteps(modelAnswer) {
  const animationSteps = modelAnswer.steps.map((step, i) => {
    animationHTML = step.html.counterHTML + step.html.outputHTML + step.html.canvasHTML;
    return { type: '', animationHTML };
  });
  animationSteps.shift();
  return animationSteps;
}

function setClickHandlers(submission) {
  $('#view-mode-button').on('click', (event) => {
		const mode = event.target.value;
		switch(mode){
			case 'detailed':
				setDetailedView();
				break;
			case 'compare':
				setCompareView();
				break;
			default:
				setCompareView();
		}
  });

  $('#compare-view-to-beginning').on('click', () => {
    $('#to-beginning').click();
    $('#model-answer-to-beginning').click();
  });
  $('#compare-view-step-backward').on('click', () => {
    $('#step-backward').click();
    $('#model-answer-step-backward').click();
  });
  $('#compare-view-step-forward').on('click', () => {
    $('#step-forward').click();
    $('#model-answer-step-forward').click();
  });
  $('#compare-view-to-end').on('click', () => {
    $('#to-end').click();
    $('#model-answer-to-end').click();
  });

	function setDetailedView() {	
		const $modeButton = $('#view-mode-button');
		$modeButton.attr({'value': 'compare'});
		$modeButton.text('Back to comparison view');
		toggleViews();
    $('#model-answer-container').html('<h3>Model answer steps visulized during the exercise</h3>');
    initializeAnimationView(submission,true);
	}

	function setCompareView() {	
		const $modeButton = $('#view-mode-button');
		$modeButton.attr({'value': 'detailed'});
		$modeButton.text('Back to comparison view');
		toggleViews();
    initializeAnimationView(submission,false);
    initializeModelAnswerView(submission);
	}

	function toggleViews() {
    $('.detailed-view').toggle();
    $('.compare-view').toggle();
    $('.model-answer-view > .view-control').toggle();
    $('#animation-container').html('');
	}

}
module.exports = {
  initialize
}
