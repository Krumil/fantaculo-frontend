import { Player } from '@/types/bestLineup'
import { ShirtIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { formationPositions } from '@/lib/lineupUtils'
import ReactDOM from 'react-dom'
import { Badge } from '@/components/ui/badge'
interface PlayerBubbleProps {
	player: Player
	formation?: keyof typeof formationPositions
	index?: number
	totalPlayers: number
}

const positionColors: { [key: string]: string } = {
	P: 'text-[#E9C46A]',  // Goalkeeper
	DD: 'text-[#264653]', // Defender
	DS: 'text-[#264653]', // Defender
	DC: 'text-[#264653]', // Defender
	B: 'text-[#264653]',  // Defender
	E: 'text-[#2A9D8F]',  // Midfielder
	M: 'text-[#2A9D8F]',  // Midfielder
	C: 'text-[#2A9D8F]',  // Midfielder
	T: 'text-[#F4A261]',  // Attacking Midfielder/Winger
	W: 'text-[#F4A261]',  // Attacking Midfielder/Winger
	A: 'text-[#E76F51]',  // Forward
	PC: 'text-[#E76F51]', // Forward
}

function getPositionColor(role: string): string {
	const mainPosition = role.split('/')[0]
	return positionColors[mainPosition] || 'text-gray-500'
}

function getColorClass(value: number | undefined): string {
	if (typeof value === 'number') {
		if (value >= 7) return 'bg-[#30693D] text-white'       // Dark Green
		else if (value >= 6.5) return 'bg-[#4F9A5D] text-white' // Green
		else if (value >= 6) return 'bg-[#93C572] text-black'   // Light Green
		else if (value >= 5.5) return 'bg-[#F0E68C] text-black' // Light Yellow (Khaki)
		else if (value >= 5) return 'bg-[#FFA500] text-black'   // Orange
		else if (value >= 4.5) return 'bg-[#FF6347] text-white' // Light Red
		else return 'bg-[#FF0000] text-white'                   // Red
	}
	return 'bg-gray-500 text-white'
}

export function PlayerBubble({ player, formation, index, totalPlayers }: PlayerBubbleProps) {
	const [isHovered, setIsHovered] = useState(false)
	const positionColor = getPositionColor(player.role)
	const playerRef = useRef<HTMLDivElement>(null)
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

	// Calculate z-index based on index
	const zIndex = totalPlayers - (index || 0)

	useEffect(() => {
		if (playerRef.current) {
			const rect = playerRef.current.getBoundingClientRect()
			setTooltipPosition({
				top: rect.top,
				left: rect.right + 2
			})
		}
	}, [isHovered])

	// Helper function to safely format numbers
	const formatNumber = (value: number | undefined) => {
		return typeof value === 'number' ? value.toFixed(2) : 'N/A'
	}

	// Helper function to safely display match information
	const formatMatch = (match: { homeTeam: string; awayTeam: string } | undefined, team: string | undefined) => {
		if (!match) return 'N/A';
		const highlightTeam = (teamName: string) => {
			if (team && teamName.toLowerCase().startsWith(team.slice(0, 3).toLowerCase())) {
				return <span className="font-bold text-white">{teamName}</span>;
			}
			return teamName;
		};
		return (
			<>
				{highlightTeam(match.homeTeam)} vs {highlightTeam(match.awayTeam)}
			</>
		);
	}

	const Tooltip = () => (
		<motion.div
			className={`fixed rounded-md p-2 w-max bg-gray-800 text-white z-50 text-sm`}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			style={{
				top: tooltipPosition.top,
				left: tooltipPosition.left,
			}}
		>
			<div className="flex flex-col gap-y-2">
				<div className="text-gray-300 text-xs text-center">{formatMatch(player.match, player.team)}</div>
				<div className="flex justify-between items-center text-xs">
					<span className="text-emerald-400">FV: {formatNumber(player.expectedFantavoto)}</span>
					<span className="text-yellow-400 ml-2">VB: {formatNumber(player.expectedVotoBase)}</span>
				</div>
				<div className="flex justify-center items-center text-xs">
					<span>{formatNumber(player.expectedNextMatchTit)}% to Start</span>
				</div>
			</div>
		</motion.div>
	)

	return (
		<>
			<motion.div
				ref={playerRef}
				className={`relative text-white rounded-full p-3 text-xs font-semibold`}
				style={{ zIndex }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div className="flex flex-col items-center">
					<div className="relative">
						<ShirtIcon
							className={`w-10 h-10 ${positionColor} transition-all duration-300 hover:scale-110`}
							style={{
								filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
								strokeWidth: 1.5,
								fill: 'currentColor'
							}}
						/>
						<div className="absolute inset-0 flex items-center justify-center text-[10px]">
							{player.positionInFormation}
						</div>
					</div>
					<div className="flex items-center justify-center my-1">
						<span className="text-sm font-semibold mr-1">{player.name}</span>
						<Badge variant="secondary" className={`text-[8px] px-1 py-0.5 ${positionColor}`}>
							{player.roleMantra?.join(' / ') || 'N/A'}
						</Badge>
					</div>
					<span className="text-xs mt-1 flex space-x-2">
						<span
							className={`px-1 rounded ${getColorClass(player.expectedFantavoto)}`}
						>
							FV: {formatNumber(player.expectedFantavoto)}
						</span>
						<span
							className={`px-1 rounded ${getColorClass(player.expectedVotoBase)}`}
						>
							VB: {formatNumber(player.expectedVotoBase)}
						</span>
					</span>
				</div>
			</motion.div>
			{isHovered && ReactDOM.createPortal(
				<AnimatePresence>
					<Tooltip />
				</AnimatePresence>,
				document.body
			)}
		</>
	)
}