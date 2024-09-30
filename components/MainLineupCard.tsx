import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShirtIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player, Formation } from '@/types/bestLineup'
import { PlayerBubble } from '@/components/PlayerBubble'
import { getPlayerPosition } from '@/lib/lineupUtils'

interface MainLineupCardProps {
	selectedModule: string | null
	mainLineup: Player[]
}

export function MainLineupCard({ selectedModule, mainLineup }: MainLineupCardProps) {
	return (
		<Card className="bg-gray-800/50 border-emerald-500/30 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-emerald-400 flex items-center">
					<ShirtIcon className="mr-2" /> Main Lineup - {selectedModule}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="relative w-full" style={{ paddingBottom: '75%' }}>
					<div className="absolute inset-0 bg-green-800/30 rounded-xl overflow-hidden backdrop-blur-sm">
						<div className="absolute inset-0 bg-[url('/soccer-field.jpg')] bg-cover bg-center opacity-20"></div>
						<AnimatePresence>
							{mainLineup.map((player, index) => {
								const formation = selectedModule?.replace(/-/g, '') || '433'
								const position = getPlayerPosition(index, formation as Formation)
								return (
									<motion.div
										key={`${player.name}-${index}`}
										className="absolute"
										style={{
											top: `${position.y}%`,
											left: `${position.x}%`,
											transform: 'translate(-50%, -50%)',
										}}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{ duration: 0.3 }}
									>
										<PlayerBubble player={player} totalPlayers={mainLineup.length} />
									</motion.div>
								)
							})}
						</AnimatePresence>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}