import { app } from 'electron'
import path from 'path'
import { isDev } from './utils.js'

export function getPreloadPath() {
  // In the dev mode, preload file is in the same directory
  // In the production mode, we need to go up two directories
  // And we will tell Electron-builder to handle the preload file separately to be placed in a different directory, that app can load the preload file first
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react', 'index.html')
}

// Electron-builder will actually bundle all of our TypeScript file inside of this electron folder into a singular file in the end, and because we actually need to load this using the file system, this can't happen
// so we'll just add another extension and write this in commonjs to avoid this
