## To run the tests
The tests are written with Jest. To run the tests do this directory:

`npm install`

`npm run test`

## Define the environment variables
Create a `.env.js` file with and define *EXEC_ENV* and *SUBMISSION_URL*. For example:
```
const EXEC_ENV = 'STATIC';
const SUBMISSION_URL = 'http://localhost:3000/submissions';

module.exports = {
  EXEC_ENV,
  SUBMISSION_URL
}
```
For static pages, which require the *exercise player* to initialize automatically when imported, define `EXEC_ENV = 'STATIC'`.

For dynamic pages, where you **do not** want the *exercise player* to initialize automatically, define `EXEC_ENV = 'DYNAMIIC'`.

If you need to retrieve the submission data from the *window* global object, define `SUBMISSION_URL = ''`.

The *initializeAnimation()* and *resetAnimationData()* methods are exposed through the *window* global object. So you can use them to initialize and reset at will.

## Bundle required modules

To bundle all the required modules in one file use [Browserify](http://browserify.org/):
`npm install -g browserify`
`browserify player.js > build/bundle.js`
Then add the bundle to the html file using a `<script>` tag like:
`<script src="<PATH>/<TO>/build/bundle.js"></script>`

Alternatively you can *import* or *require* the bundle file.

## Fetching the submission data
If *SUBMISSION_URL* is defined in `.env.js`, the *exercise player* will try fetching from the given url. Otherwise, if *SUBMISSION_URL* is undefined, the *exercise player* will try to retrieve the data from `window.submission`.

## Example use with React
```
...
import "../jsav-exercise-player/build/player-bundle.js"
...
componentWillUnmount() {
  window.resetAnimationData();
}

render() {
  const  submission = window.submission;

  if(window.$ !== undefined && submission) {
    setTimeout(() => {
      window.initializeAnimation(window.JSAV, submission)
    }, 100);
    return (
              //the player.html content here...
```
