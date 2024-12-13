// we are writing commonjs for the loading after build
// TypeScript will compile this file into .cjs
const { contextBridge, ipcRenderer } = require('electron')

// contextBridge bridges data between electron process and main window
// adding an object called electron to our window
contextBridge.exposeInMainWorld('electron', {
  // One way of communication
  // statistics will be sent to the frontend using that callback
  // type this in the console of front end: window.electron.subscribeStatistics(console.log(1)), you will get 1
  subscribeStatistics: (sayWhat: (statistics: any) => void) => {
    // use this event to get info about who published this event that coming from the trusted sources
    // but now we don't care about it, we just use _ instead
    // stats is just the statistics we are sending
    ipcRenderer.on('statistics', (_, stats) => {
      sayWhat(stats)
    })
  },
  // Another way of communication
  // Return what we want to return from main process, return a promise
  // we don't need second parameter here, defining what event we actually want to listen for is completely plenty
  // go back to the main process setup the ipcMain for this
  getStaticData: () => ipcRenderer.invoke('getStaticData'),
})
