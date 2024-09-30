import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Player } from '@/types/bestLineup'
import { PlayerCard } from '@/components/PlayerCard'

interface BenchPlayersProps {
	bench: Player[]
}

export function BenchPlayers({ bench }: BenchPlayersProps) {
	return (
		<Card className="bg-gray-800/50 border-emerald-500/30 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-xl font-bold text-emerald-400">Bench Players</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
					{bench.map((player) => (
						<PlayerCard key={player.name} player={player} />
					))}
				</div>
			</CardContent>
		</Card>
	)
}