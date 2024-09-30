export interface Player {
	name: string;
	role: string;
	team: string;
	teamSlug: string;
	match: {
		awayTeam: string;
		homeTeam: string;
	};
	expectedNextMatchTit: number;
	expectedFantavoto: number;
	expectedVotoBase: number;
	playerStatus: string;
	ranking: number;
	roleMantra: string[];
	positionInFormation: string;
}
export interface Module {
	adviced: boolean
	bestPercentage: number
	fm: number
	lessPercentage: number
	modificatoreDifesa: number
	module: string
}

export interface BestLineupData {
	modules: Module[]
	pitch: {
		main: Record<string, Player[]>
		bench: Player[]
	}
	chartData: { x: number; y: number }[]
	fasceGoal: [number, number][]
	goalPercentages: { [key: string]: number }
	asseXDistribuzioneFantaMediaTotale: number[]
	asseYDistribuzioneFantaMediaTotale: number[]
}

export type Formation =
	| '343' | '3412' | '3421' | '352' | '3511'
	| '433' | '4312' | '442' | '4141' | '4411' | '4231'