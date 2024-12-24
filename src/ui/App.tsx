import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Chart } from './components/Chart'
import { useStatistics } from './hooks/useStatistics'

function App() {
  const [activeView, setActiveView] = useState<View>('CPU')
  const statisticsData = useStatistics(10)
  const cpuUsages = useMemo(
    () =>
      statisticsData.map((data) => {
        return data.cpuUsage
      }),
    [statisticsData]
  )
  const ramUsages = useMemo(
    () =>
      statisticsData.map((data) => {
        return data.ramUsage
      }),
    [statisticsData]
  )
  const storageUsages = useMemo(
    () =>
      statisticsData.map((data) => {
        return data.storageData
      }),
    [statisticsData]
  )

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsages
      case 'RAM':
        return ramUsages
      case 'STORAGE':
        return storageUsages
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages])

  // console.log(statisticsData)
  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view))
  }, [])
  return (
    <>
      <h1>fight club</h1>
      <div style={{ height: 120 }}>
        {/* <BaseChart data={[{ value: 25 }, { value: 30 }, { value: 100 }]} /> */}
        <Chart data={activeUsages} maxDataPoints={10} />
      </div>
    </>
  )
}

export default App
