import { useMemo } from 'react'
import './App.css'
import { Chart } from './components/Chart'
import { useStatistics } from './hooks/useStatistics'

function App() {
  const statisticsData = useStatistics(10)
  const cpuUsages = useMemo(
    () =>
      statisticsData.map((data) => {
        return data.cpuUsage
      }),
    [statisticsData]
  )

  // console.log(statisticsData)
  return (
    <>
      <h1>fight club</h1>
      <div style={{ height: 120 }}>
        {/* <BaseChart data={[{ value: 25 }, { value: 30 }, { value: 100 }]} /> */}
        <Chart data={cpuUsages} maxDataPoints={10} />
      </div>
    </>
  )
}

export default App
