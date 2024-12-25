// d means defining the global types
// this file is the contract between our frontend and backend
// All the types we shared with our frontend and backend
// no need to export the types
type Statistics = {
  cpuUsage: number
  ramUsage: number
  storageData: number
}

type StaticData = {
  totalStorage: number
  cpuModel: string
  cpuSpeed: number
  totalMemoryGB: number
}

type View = 'CPU' | 'RAM' | 'STORAGE'

type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE'

// Creating an adapter from one side to the other and vice versa
// We only IPC inside the adapters
// key is the event name
type EventPayloadMapping = {
  statistics: Statistics
  getStaticData: StaticData
  changeView: View
  sendFrameAction: FrameWindowAction
}

// doesn't return anything called side effect function
type UnsubscribeFunction = () => void

// if we define an interface that already exists like the Window, we are basically adding stuff to the existing interface
interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => UnsubscribeFunction
    // getStaticData expects a function that returns Promise<value>
    getStaticData: () => Promise<StaticData>
    subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFunction
    sendFrameAction: (Payload: FrameWindowAction) => void
  }
}
