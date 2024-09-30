import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChartIcon } from 'lucide-react'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	ReferenceLine,
} from 'recharts'

interface FantasyMediaChartProps {
	chartData: { x: number; y: number }[]
	fasceGoal: [number, number][]
	goalPercentages: { [key: string]: number }
}

const CustomTooltip = ({ active, payload, label, expectedScore }: any) => {
	if (active && payload && payload.length) {
		const percentage = ((payload[0].value / expectedScore) * 100).toFixed(2)
		return (
			<div className="custom-tooltip bg-gray-800 p-2 border border-emerald-500/30">
				<p className="label text-emerald-400">{`Score: ${payload[0].value}`}</p>
				<p className="percentage text-emerald-400">{`Percentage of Expected: ${percentage}%`}</p>
				<p className="probability text-emerald-400">{`Probability: ${(payload[0].payload.y * 100).toFixed(2)}%`}</p>
			</div>
		)
	}
	return null
}

export function FantasyMediaChart({ chartData, fasceGoal, goalPercentages }: FantasyMediaChartProps) {
	const totalArea = chartData.reduce((sum, point) => sum + point.y, 0)
	const normalizedChartData = chartData.map(point => ({
		...point,
		y: point.y / totalArea,
	}))

	const goalRanges = [
		{ min: 0, max: 66, label: "0 Goal" },
		{ min: 66, max: 70, label: "1 Goal" },
		{ min: 70, max: 74, label: "2 Goal" },
		{ min: 74, max: 78, label: "3 Goal" },
		{ min: 78, max: Infinity, label: "4+ Goal" },
	]

	return (
		<Card className="bg-gray-800/50 border-emerald-500/30 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-emerald-400 flex items-center">
					<BarChartIcon className="mr-2" /> Fantasy Media Distribution
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div style={{ width: '100%', height: 300 }}>
					<ResponsiveContainer>
						<AreaChart data={normalizedChartData}>
							<defs>
								<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="x" />
							<YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip content={<CustomTooltip />} />
							<Area type="monotone" dataKey="y" stroke="#10b981" fillOpacity={1} fill="url(#colorUv)" />
							{fasceGoal.map(([score, probability], index) => (
								<ReferenceLine
									key={index}
									x={score}
									stroke="#fbbf24"
									label={{ value: `${index} Goal`, position: "top", fill: "#fbbf24" }}
								/>
							))}
						</AreaChart>
					</ResponsiveContainer>
				</div>
				<div className="mt-4 text-emerald-400">
					<h3 className="mt-2 font-semibold">Goal Probabilities:</h3>
					<ul>
						{goalPercentages && Object.entries(goalPercentages).map(([label, percentage], index) => (
							<li key={index}>
								{label}: {percentage}%
							</li>
						))}
						{!goalPercentages && <li>No goal percentage data available</li>}
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}