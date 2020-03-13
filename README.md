## To run the tests
The tests are written with Jest. To run the tests do this directory:

`npm install`

`npm run test`

## Define the EXEC_ENV environment variable
Create a `.env.js` file with and define the EXEC_ENV.

For static pages, which require the *exercise player* to initialize automatically when imported:
```
EXEC_ENV = 'STATIC'
```

For dynamic pages, where you **do not** want the *exercise player* to initialize automatically:
```
EXEC_ENV = 'DYNAMIIC'
```

The *initializeAnimation()* and *resetAnimationData()* methods are exposed through the *window* global object. So you can use them to initialize and reset at will.

## Bundle required modules

To bundle all the required modules in one file use [Browserify](http://browserify.org/):
`npm install -g browserify`
`browserify player.js > build/bundle.js`
Then add the bundle to the html file using a `<script>` tag like:
`<script src="<PATH>/<TO>/build/bundle.js"></script>`

Alternatively you can *import* or *require* the bundle file.

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
