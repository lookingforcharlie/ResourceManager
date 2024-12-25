import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath } from './pathResolver.js'

export function isDev(): boolean {
  console.log('checking node_env in isDev func: ', process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development'
}

// When we don't know the type until we got a parameter, we can make it generic type
// keyof EventPayloadMapping is 'statistics' or 'getStaticData'
// type the function based on the mapping type
export function ipcMainHandle<key extends keyof EventPayloadMapping>(
  key: key,
  handler: () => EventPayloadMapping[key]
) {
  ipcMain.handle(key, (event) => {
    console.log('senderFrame', event.senderFrame?.url)
    if (event.senderFrame != null) {
      validateEventFrame(event.senderFrame)
    }
    return handler()
  })
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload)
}

// what's the use case?
export function validateEventFrame(frame: WebFrameMain) {
  console.log('validating frame url:', frame.url)
  // validate the event in Dev mode
  if (isDev() && new URL(frame.url).host === 'localhost:5123') return

  // validate the event in production mode
  // turn the url into something look like file://app/ui/index.html
  // this is not a full proof solution, if you have multiple files in your electron app, this won't work
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Malicious event')
  }
}

// listen to sendFrameAction
export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    if (event.senderFrame != null) {
      validateEventFrame(event.senderFrame)
    }
    return handler(payload)
  })
}
