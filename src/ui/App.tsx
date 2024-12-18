import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    // return a unSub from the main process
    const unSub = window.electron.subscribeStatistics((stats) =>
      console.log(stats)
    )
    // if you return a function from a useEffect, it will run either when the dependencies changed or when the component unmounts, basically if it isn't rendered anymore
    return unSub
  }, [])
  return (
    <>
      <h1>fight club</h1>
    </>
  )
}

export default App
