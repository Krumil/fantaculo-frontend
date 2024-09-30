'use client'

import { useEffect, useState, useMemo } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, TrophyIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BestLineupData, Player, Formation } from '@/types/bestLineup'
import { MainLineupCard } from '@/components/MainLineupCard'
import { FantasyMediaChart } from '@/components/FantasyMediaChart'
import { ModuleSelector } from '@/components/ModuleSelector'
import { BenchPlayers } from '@/components/BenchPlayers'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { fetchBestLineupData } from '@/lib/api'
import { updateLineup } from '@/lib/lineupUtils'

export default function BestLineup() {
	const [data, setData] = useState<BestLineupData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [selectedModule, setSelectedModule] = useState<string | null>(null)
	const [mainLineup, setMainLineup] = useState<Player[]>([])
	const [chartData, setChartData] = useState<{ x: number; y: number }[]>([])

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedData = await fetchBestLineupData()
				setData(fetchedData)
				const initialModule = fetchedData.modules.find((m) => m.adviced)?.module || fetchedData.modules[0]?.module
				setSelectedModule(initialModule)
				setMainLineup(updateLineup(fetchedData, initialModule as Formation))
				setChartData(
					fetchedData.asseXDistribuzioneFantaMediaTotale.map((xValue, index) => ({
						x: xValue,
						y: fetchedData.asseYDistribuzioneFantaMediaTotale[index],
					}))
				)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An unknown error occurred')
			}
		}

		loadData()
	}, [])

	const handleModuleChange = (moduleType: string) => {
		setSelectedModule(moduleType)
		if (data) {
			setMainLineup(updateLineup(data, moduleType as Formation))
		}
	}

	const bench = useMemo(() => data?.pitch.bench || [], [data])

	if (error) {
		return <ErrorAlert message={error} />
	}

	if (!data) {
		return <LoadingSkeleton />
	}

	return (
		<div className="container mx-auto p-4 min-h-screen">
			<PageTitle />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<MainLineupCard selectedModule={selectedModule} mainLineup={mainLineup} />
				</div>
				<div className="space-y-8">
					<Tabs defaultValue="formations">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="formations">Formations</TabsTrigger>
							<TabsTrigger value="bench">Bench</TabsTrigger>
						</TabsList>
						<TabsContent value="formations">
							<ModuleSelector
								modules={data.modules}
								selectedModule={selectedModule}
								onModuleChange={handleModuleChange}
							/>
						</TabsContent>
						<TabsContent value="bench">
							<BenchPlayers bench={bench} />
						</TabsContent>
					</Tabs>
				</div>
				<div className="lg:col-span-3">
					<FantasyMediaChart
						chartData={chartData}
						fasceGoal={data.fasceGoal}
						goalPercentages={data.goalPercentages}
					/>
				</div>
			</div>
		</div>
	)
}

function PageTitle() {
	return (
		<motion.h1
			className="text-4xl font-extrabold mb-8 text-emerald-400 flex items-center justify-center"
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<TrophyIcon className="mr-2" /> Best Lineup
		</motion.h1>
	)
}

function ErrorAlert({ message }: { message: string }) {
	return (
		<Alert variant="destructive" className="bg-rose-900/80 text-white backdrop-blur-sm m-4">
			<AlertTriangle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}