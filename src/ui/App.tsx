import './App.css'

function App() {
  //@ts-expect-error: "joke"
  window.electron.getStaticData()

  return (
    <>
      <h1>fight club</h1>
    </>
  )
}

export default App
