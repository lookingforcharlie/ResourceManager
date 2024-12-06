import { app, BrowserWindow } from 'electron'
import path from 'path'
import { pollResources } from './resourceManager.js'
import { isDev } from './utils.js'

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // contextIsolation: false, // insecure, allow the access of the whole node.js in the backend
      // nodeIntegration: true, // insecure
      // preload expects a path, it's different in dev and production mode, so created pathResolver.ts to solve it
      // preload:
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

  pollResources()
})
