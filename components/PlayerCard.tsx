import { Player } from '@/types/bestLineup'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PlayerCardProps {
	player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
	return (
		<Card className="bg-gray-700/50 border-gray-600/30">
			<CardContent className="p-2">
				<div className="flex justify-between items-center mb-1">
					<div className="font-semibold text-sm">{player.name}</div>
					<Badge variant="secondary" className="text-xs">{player.roleMantra.join(' / ')}</Badge>
				</div>
				<div className="flex justify-between items-center text-xs">
					<div className="text-gray-400">{player.team}</div>
					<div className="text-gray-500">{player.match.homeTeam} vs {player.match.awayTeam}</div>
				</div>
				<div className="flex justify-between items-center mt-1 text-xs">
					<span className="text-emerald-400">FV: {player.expectedFantavoto.toFixed(2)}</span>
					<span className="text-yellow-400">VB: {player.expectedVotoBase.toFixed(2)}</span>
				</div>
			</CardContent>
		</Card>
	)
}