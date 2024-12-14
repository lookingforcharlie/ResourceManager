import { ipcMain, WebContents } from 'electron'

export function isDev(): boolean {
  console.log('node_env: ', process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development'
}

// When we don't know the type until we got a parameter, we can make it generic type
// keyof EventPayloadMapping is 'statistics' or 'getStaticData'
// type the function based on the mapping type
export function ipcMainHandle<key extends keyof EventPayloadMapping>(
  key: key,
  handler: () => EventPayloadMapping[key]
) {
  ipcMain.handle(key, () => handler())
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload)
}
