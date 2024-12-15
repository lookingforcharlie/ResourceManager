import { BrowserWindow } from 'electron'
import fs from 'fs'
import os from 'os'
import osUtils from 'os-utils'
import { ipcWebContentsSend } from './utils.js'

// we want update the resource every half second
const POLLING_INTERVAL = 500

// mainWindow will need to be passed as a reference to whole resource because we are currently not in the scope where it exists
export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage()
    const ramUsage = await getRamUsage()
    const storageData = getStorageData()
    const statisticsPayload = {
      cpuUsage,
      ramUsage,
      storageData: storageData.usage,
    }

    // On the event bus called 'statistics', we are sending the data every 5 seconds
    // If the front wants, it can listen to the event
    mainWindow.webContents.send('statistics', statisticsPayload)
    ipcWebContentsSend('statistics', mainWindow.webContents, statisticsPayload)
    // console.log(statisticsPayload)
  }, POLLING_INTERVAL)
}

export function getStaticData(): StaticData {
  const totalStorage = getStorageData().total
  const cpuModel = os.cpus()[0].model
  const cpuSpeed = os.cpus()[0].speed
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024)

  const staticDataPayload = {
    totalStorage,
    cpuModel,
    cpuSpeed,
    totalMemoryGB,
  }

  return staticDataPayload
}

// getting cpu usage
// return the cpu percentage with a promise
// don't want console.log inside a callback, I want it return from the above function
// this promise approach is more modern and easier for error handling by wrapping it with try catch
function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percentage) => {
      resolve(percentage)
    })
  })
  // this return equals to
  // return new Promise((resolve) => {
  //   osUtils.cpuUsage(resolve)
  // })
}

// getting ram usage
function getRamUsage(): Promise<number> {
  return new Promise((resolve) => {
    resolve(1 - osUtils.freememPercentage())
  })
}

function getStorageData() {
  // get the root
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/')
  const total = stats.bsize * stats.blocks
  const free = stats.bsize * stats.bfree

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  }
}
