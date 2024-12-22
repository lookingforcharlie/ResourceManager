import { useMemo } from 'react'
import BaseChart from './BaseChart'

export type ChartProps = {
  data: number[]
  maxDataPoints: number
}

export function Chart(props: ChartProps) {
  const { data, maxDataPoints } = props
  const preparedData = useMemo(
    // because chart domain is 0 - 100 right now, and point is 0 - 1
    () => {
      const points = data.map((point) => ({ value: point * 100 }))
      // creating an array at the end, if we need length 10 array, we only have 5, then we add another 5 at the end
      // map and return each value of item as undefined to satisfy the type for drilling down
      return [
        ...points,
        ...Array.from({ length: maxDataPoints - points.length }).map(() => ({
          value: undefined,
        })),
      ]
    },
    [data, maxDataPoints]
  )

  return <BaseChart data={preparedData} />
}
