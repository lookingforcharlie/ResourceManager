// run "node src/electron/gibberish.js" to execute this file

// setInterval(() => {
//   console.log('hello world')
// }, 1000)

// asynchronous code is code that runs and finish at a later time
// synchronous code run sequentially

// Promise takes in one argument which happens to be a callback function
// this callback takes two arguments resolve and reject
const myPromise = new Promise((resolve, reject) => {
  console.log('I am a promise')
  resolve(444)
})
  .then((value) => {
    console.log('1', value)
    return 'I want you to hit me as hard as you can'
  })
  .then((value) => console.log(value))
