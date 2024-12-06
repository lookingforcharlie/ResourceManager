import fs from 'fs'
import os from 'os'
import osUtils from 'os-utils'

// we want update the resource every half second
const POLLING_INTERVAL = 500

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage()
    const ramUsage = await getRamUsage()
    const storageData = getStorageData()
    console.log({ cpuUsage, ramUsage, storageData: storageData.usage })
  }, POLLING_INTERVAL)
}

export function getStaticData() {
  const totalStorage = getStorageData().total
  const cpuModel = os.cpus()[0].model
  const cpuSpeed = os.cpus()[0].speed
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024)

  return {
    totalStorage,
    cpuModel,
    cpuSpeed,
    totalMemoryGB,
  }
}

// getting cpu usage
// return the cpu percentage with a promise
// don't want console.log inside a callback, I want it return from the above function
// this promise approach is more modern and easier for error handling by wrapping it with try catch
function getCpuUsage() {
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
function getRamUsage() {
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
