import { useEffect, useState } from 'react'

// we will render a range of data point count, meaning I will render 20 points of Statistics maximum
export function useStatistics(dataPointCount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([])
  useEffect(() => {
    // return a unSub from the main process
    const unSub = window.electron.subscribeStatistics((stats) =>
      setValue((prevValue) => {
        // console.log(stats)
        const newData = [...prevValue, stats]
        if (newData.length > dataPointCount) {
          // Removes the first element from an array and returns it
          // make sure newData that only contains the latest Statistics within the range of dataPointCount
          newData.shift()
        }
        return newData
      })
    )
    // if you return a function from a useEffect, it will run either when the dependencies changed or when the component unmounts, basically if it isn't rendered anymore
    return unSub
  }, [dataPointCount])

  return value
}
