import { app, BrowserWindow } from 'electron'
import path from 'path'
import { getPreloadPath } from './pathResolver.js'
import { getStaticData, pollResources } from './resourceManager.js'
import { ipcMainHandle, isDev } from './utils.js'

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // contextIsolation: false, // insecure, allow the access of the whole node.js in the backend
      // nodeIntegration: true, // insecure
      // preload expects a path, it's different in dev and production mode, so created pathResolver.ts to solve it
      // run this script before you open the window and attach everything in the contextBridge in the preload.cts
      preload: getPreloadPath(),
    },
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123')
  } else {
    // index.html file from dist-react directory
    mainWindow.loadFile(
      path.join(app.getAppPath(), '/dist-react', 'index.html')
    )
  }

  // Since the function of setInterval, this function is always running even no subscribe of 'statistics' from frontend
  // TODO: is this a problem, more graceful way to handle this or not?
  // perhaps it's ok in this case, cos the whole application is about sending resource to the frontend and render them
  // TODO: Another question, once ipcRender.on is on, any way to make it off?
  pollResources(mainWindow)

  // send not expecting anyone listen for it
  // we are using handle here, because UI expecting the backend to respond it needs to handle it
  // when the event comes in, we will call another callback
  // ipcMain.handle('getStaticData', () => {
  //   return getStaticData()
  // })

  ipcMainHandle('getStaticData', () => {
    return getStaticData()
  })
})
