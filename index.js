// This is a comment in javascript.

// Function Declaration
function onReady () {
  console.log('Document is ready.');
}

console.log('This is a message output to the javascript console.')
console.warn('This is a warning.')
console.error('This is an error.')

document.addEventListener("DOMContentLoaded", function (event) {
  // This code will fire only when the document is fully loaded and ready to go.
  onReady() // Call the function we have declared above.
});