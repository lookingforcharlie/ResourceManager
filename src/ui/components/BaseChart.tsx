// prototyping how to use the library
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

type BaseChartProps = {
  data: { value: number | undefined }[]
  fill: string
  stroke: string
}

export default function BaseChart(props: BaseChartProps) {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {/* Everything inside AreaChart is parallel */}
      <AreaChart data={props.data}>
        <CartesianGrid stroke='#333' strokeDasharray='5 5' fill='#1C1C1C' />
        <Area
          fillOpacity={0.3}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={2}
          type='monotone'
          dataKey='value' // 'value' aligns with the key from props
          isAnimationActive={false}
        />
        <XAxis stroke='transparent' height={0} />
        {/* domain 1, 100 is like 100% */}
        <YAxis domain={[0, 100]} stroke='transparent' width={0} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
