import { BestLineupData } from '@/types/bestLineup'

export async function fetchBestLineupData(): Promise<BestLineupData> {
	const response = await fetch(
		'https://fantaculo.it/pyengine-srv/api/v1/bestlineup?nomeLega=fantanale-24--25&competitionId=606042&idSquadra=13460024'
	)
	if (!response.ok) {
		throw new Error('Failed to fetch best lineup data')
	}
	return await response.json()
}