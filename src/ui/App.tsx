import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Chart } from './components/Chart'
import { useStatistics } from './hooks/useStatistics'

function App() {
  const [activeView, setActiveView] = useState<View>('CPU')
  const staticData = useStaticData()
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
    <div className='App'>
      <Header />
      <div className='main'>
        <div>
          <SelectOption
            title='CPU'
            subTitle={
              (staticData?.cpuModel ?? '') + ' Speed: ' + staticData?.cpuSpeed
            }
            data={cpuUsages}
            onClick={() => setActiveView('CPU')}
          />
          <SelectOption
            title='RAM'
            subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
            data={ramUsages}
            onClick={() => setActiveView('RAM')}
          />
          <SelectOption
            title='STORAGE'
            subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
            data={storageUsages}
            onClick={() => setActiveView('STORAGE')}
          />
        </div>
        <div className='mainGrid'>
          {/* <BaseChart data={[{ value: 25 }, { value: 30 }, { value: 100 }]} /> */}
          <Chart
            data={activeUsages}
            maxDataPoints={10}
            selectedView={activeView}
          />
        </div>
      </div>
    </div>
  )
}

function SelectOption(props: {
  title: View
  subTitle: string
  data: number[]
  onClick: () => void
}) {
  return (
    <button className='selectOption' onClick={props.onClick}>
      <div className='selectOptionTitle'>
        <div>{props.title}</div>
        <div>{props.subTitle}</div>
      </div>
      <div className='selectOptionChart'>
        <Chart
          data={props.data}
          maxDataPoints={10}
          selectedView={props.title}
        />
      </div>
    </button>
  )
}

function Header() {
  return (
    <header>
      <button
        id='close'
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id='minimize'
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id='maximize'
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  )
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null)

  useEffect(() => {
    ;(async () => {
      setStaticData(await window.electron.getStaticData())
    })()
  }, [])

  return staticData
}

export default App
