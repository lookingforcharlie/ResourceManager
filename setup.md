# Electron/React/TypeScript Application

## Setup

1. npm create vite .
2. npm install
3. Put everything inside src/ui
4. npm install --save-dev electron [electron isn't needed in the final bundle of the app]
5. create src/electron folder for electron
6. setup the script for electron
7. setup tsconfig.json file for electron
8. ./tsconfig.json is for react project
9. transpile main.ts to main.js into dist-electron folder
10. use electron builder to build electron [npm i -D electron-builder]
11. set up electron-builder.json for building the app execution
12. setup for using vite hot reloading, because at this moment when you run 'npm run dev:electron', the modification you make on the react pages not gonna show it on electron app instantly
13. For realizing the hot load, we need to 'npm i -D cross-env', create isDev util function, setup a vite server in vite.config.ts file
14. Now, when we run 'npm run dev:react' in one terminal, and 'npm run dev:electron' in another terminal, we can realize the hot load. but this is ridiculous, who wants do that. Let's fix it.
15. 'npm install -D npm-run-all', use it to run dev:react and dev:electron in parallel

## what's going on with the setup

- once you run "npm run dist:mac", you generate a .dmg in /Users/xiaobing/Code/electron/resource_manager /dist/mac-arm64
- you can just run it, it's awesome

## Development

1. npm i os-utils [to get all system information]
2. os-utils doesn't bring its own types, we need to npm i -D @types/os-utils

## Issue

- In electron-builder.json file, need a line of ""icon": "./desktopIcon.png"," under files, "icon" is actually for building execution file in Windows, because Windows always require a icon when building. The icon needs to be at lease 255 X 255 pixels png

## Understanding Electron

- Using IPC-Bus as a channel and ipcRenderer as customized protocol to communicate between main process and UI
- UI will use ipcRenderer to render data from main, but chromium doesn't have it. We need to send it from main process
- use window.require('electron') in UI makes every node modules exposed to UI, which is unsecure
- preload script is a preferred way in Electron
- run preload before windows initialized and append the data to the window object inside our browser window
- Preload script will have some kind of a wrapper around the IPC bus using IPC renderer
