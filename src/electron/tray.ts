import { app, BrowserWindow, Menu, Tray } from 'electron'
import path from 'path'
import { getAssetPath } from './pathResolver.js'

// handle tray icon behavior
export function createTray(mainWindow: BrowserWindow) {
  // creating the tray on mac, it will be on the top bar, parameter as tray icon
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'
    )
  )

  // the menu will pop up when you click the tray icon
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show()
          // when the mainWindow pops up, the icon in the dock will show as well
          if (app.dock) {
            app.dock.show()
          }
        },
      },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ])
  )
}
