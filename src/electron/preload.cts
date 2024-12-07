// we are writing commonjs for the loading after build
// TypeScript will compile this file into .cjs
const electron = require('electron')

// contextBridge bridges data between electron process and main window
// adding an object called electron to our window
electron.contextBridge.exposeInMainWorld('electron', {
  // statistics will be sent to the frontend using that callback
  // type this in the console of front end: window.electron.subscribeStatistics(console.log(1)), you will get 1
  subscribeStatistics: (callback: (statistics: any) => void) => callback({}),
  getStaticData: () => console.log('static'),
})
