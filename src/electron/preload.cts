// preload script shares a global Window interface with the renders
// we are writing commonjs for the loading after build
// TypeScript will compile this file into .cjs
const { contextBridge, ipcRenderer } = require('electron')

// contextBridge bridges data between electron process and main window
// adding an object called electron to our window
contextBridge.exposeInMainWorld('electron', {
  // One way of communication
  // statistics will be sent to the frontend using that callback
  // type this in the console of front end: window.electron.subscribeStatistics(console.log(1)), you will get 1
  subscribeStatistics: (callback) => {
    // ipcRenderer.on is used to listen for messages sent from the main process via webContents.send
    // use this event to get info about who published this event that coming from the trusted sources
    // but now we don't care about it, we just use _ instead
    // stats is just the statistics we are sending

    // ipcRenderer.on('statistics', (_, stats) => {
    //   callback(stats)
    // })
    return ipcOn('statistics', (stats) => callback(stats))
  },
  // Another way of communication
  // ipcRenderer.invoke('getStaticData') sends a message to the main process and expects a Promise<response>
  // we don't need second parameter here, defining what event we actually want to listen for is completely plenty
  // go back to the main process setup the ipcMain for this
  // getStaticData: () => ipcRenderer.invoke('getStaticData'),
  getStaticData: () => ipcInvoke('getStaticData'),
  subscribeChangeView: (callback) => {
    return ipcOn('changeView', (stats) => callback(stats))
  },
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
} satisfies Window['electron'])

// All the frontend electron stuff happens inside preload script, and we want to expose as little of electron as possible
// we need define ipc wrapper functions in preload script, not in utils.ts, because the electron-builder doesn't allow us to import utils.ts inside to our preload script, because cts file can't import ts file, and vice versa
// this approach of creating ipc wrapper function seems verbose and over-engineering, but it accomplishes that we never use ipc directly from the frontend, and only use the adapters we predefined, and everything is type safe from both frontend and backend
function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)

  ipcRenderer.on(key, cb)
  // using .off to unsubscribe as soon as the key and reference function are the same
  return () => ipcRenderer.off(key, cb)
}

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key)
}

// send window action, not expecting anything
function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  ipcRenderer.send(key, payload)
}
