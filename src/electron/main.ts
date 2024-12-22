import { app, BrowserWindow } from 'electron'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { getStaticData, pollResources } from './resourceManager.js'
import { createTray } from './tray.js'
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
    mainWindow.loadFile(getUIPath())
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

  // this is how to handle quit in Windows
  // app.on('window-all-closed', function () {
  //   if (process.platform !== 'darwin') app.quit()
  // })

  createTray(mainWindow)
  handleCloseEvents(mainWindow)
})

function handleCloseEvents(mainWindow: BrowserWindow) {
  // Default, we don't want the app close
  let willClose = false
  mainWindow.on('close', (e) => {
    if (willClose) {
      return
    }
    e.preventDefault()
    // do everything on Windows and Linux, but not everything on Mac
    mainWindow.hide()
    // with this, you won't see the electron icon in the Mac bottom dock
    if (app.dock) {
      app.dock.hide()
    }

    // before quit event
    app.on('before-quit', () => {
      willClose = true
    })

    // click the tray icon, open the window back up
    mainWindow.on('show', () => {
      willClose = false
    })
  })
}
