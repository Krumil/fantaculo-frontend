import { BestLineupData, Player, Formation } from '@/types/bestLineup'

export const formationPositions: { [key in Formation]: string[] } = {
	'343': ['P', 'DC', 'DC', 'DC/B', 'E', 'M/C', 'C', 'E', 'W/A', 'A/PC', 'W/A'],
	'3412': ['P', 'DC', 'DC', 'DC/B', 'E', 'M/C', 'C', 'E', 'T', 'A/PC', 'A/PC'],
	'3421': ['P', 'DC', 'DC', 'DC/B', 'E', 'M', 'M/C', 'E/W', 'T/A', 'T', 'A/PC'],
	'352': ['P', 'DC', 'DC', 'DC/B', 'E', 'M', 'M/C', 'C', 'E', 'T/A', 'A/PC'],
	'3511': ['P', 'DC', 'DC', 'DC/B', 'E/W', 'M', 'C', 'M', 'E/W', 'T/A', 'A/PC'],
	'433': ['P', 'DS', 'DC', 'DC', 'DD', 'M/C', 'M', 'C', 'W/A', 'A/PC', 'W/A'],
	'4312': ['P', 'DS', 'DC', 'DC', 'DD', 'M/C', 'M', 'C', 'T', 'A/PC', 'A/PC'],
	'442': ['P', 'DS', 'DC', 'DC', 'DD', 'E/W', 'M/C', 'C', 'E/W', 'A/PC', 'A/PC'],
	'4141': ['P', 'DS', 'DC', 'DC', 'DD', 'M', 'E/W', 'C/T', 'T', 'E/W', 'A/PC'],
	'4411': ['P', 'DS', 'DC', 'DC', 'DD', 'E/W', 'M', 'C', 'E/W', 'T/A', 'A/PC'],
	'4231': ['P', 'DS', 'DC', 'DC', 'DD', 'M', 'M/C', 'W/T', 'T', 'W/A', 'A/PC'],
}

const mantraRoles = ['Por', 'B', 'DC', 'DD', 'DS', 'E', 'M', 'C', 'W', 'T', 'A', 'PC'];

function isCompatibleRole(playerRole: string, positionRole: string): boolean {
	const playerRoles = playerRole.split('/').map(role => role.toUpperCase());
	const positionRoles = positionRole.split('/').map(role => role.toUpperCase());
	if (playerRoles.includes('P') && positionRoles.includes('Por')) {
		return true;
	}
	return playerRoles.some(role => positionRoles.includes(role));
}

function getMantraRole(role: string): string {
	const roles = role.split('/');
	for (const r of roles) {
		if (mantraRoles.includes(r)) {
			return role;
		}
	}
	return roles[0]; // Return the first role if no exact match is found
}

function calculateCompatibilityScore(player: Player, positionRole: string): number {
	const playerRoles = player.roleMantra?.join('/') || '';
	if (!isCompatibleRole(playerRoles, positionRole)) {
		return 0;
	}

	const playerRoleArray = playerRoles.split('/');
	const positionRoleArray = positionRole.split('/');

	// Calculate score based on the number of matching roles
	const matchingRoles = playerRoleArray.filter(role => positionRoleArray.includes(role));
	return matchingRoles.length;
}

export function updateLineup(data: BestLineupData, formation: Formation): Player[] {
	if (data.pitch && data.pitch.main) {
		const allPlayers = ['p', 'd', 'c', 'a'].flatMap((position) => data.pitch.main[position] || []);
		const formationRoles = formationPositions[formation];

		const assignedPlayers: Player[] = [];
		let unassignedPlayers: Player[] = [...allPlayers];

		// Create a compatibility matrix
		const compatibilityMatrix = unassignedPlayers.map(player =>
			formationRoles.map(role => calculateCompatibilityScore(player, role))
		);

		// Assign players to positions
		for (let i = 0; i < formationRoles.length; i++) {
			let bestScore = -1;
			let bestPlayerIndex = -1;

			for (let j = 0; j < unassignedPlayers.length; j++) {
				const score = compatibilityMatrix[j][i];
				if (score > bestScore) {
					bestScore = score;
					bestPlayerIndex = j;
				}
			}

			if (bestPlayerIndex !== -1) {
				const player = unassignedPlayers[bestPlayerIndex];
				const mantraRole = getMantraRole(formationRoles[i]);
				console.log(player.name, mantraRole);
				assignedPlayers.push({ ...player, positionInFormation: mantraRole });
				unassignedPlayers = unassignedPlayers.filter((_, index) => index !== bestPlayerIndex);
				compatibilityMatrix.splice(bestPlayerIndex, 1);
			} else {
				console.warn(`No compatible player found for position ${formationRoles[i]}`);
				const mantraRole = getMantraRole(formationRoles[i]);
				assignedPlayers.push({ name: 'Unknown', role: mantraRole, positionInFormation: mantraRole } as Player);
			}
		}

		if (unassignedPlayers.length > 0) {
			console.warn(`${unassignedPlayers.length} players could not be assigned a position`);
		}

		return assignedPlayers;
	} else {
		console.error('Unexpected data structure:', data);
		return [];
	}
}

export function getPlayerPosition(index: number, formation: Formation): { x: number; y: number } {
	const formationDigits = formation.split('').map(Number);
	const rows = formationDigits.length + 1; // Including goalkeeper row

	let row = 0;
	let positionInRow = 0;
	let remainingPlayers = index + 1;

	while (remainingPlayers > 0) {
		const playersInRow = row === 0 ? 1 : formationDigits[row - 1];
		if (remainingPlayers <= playersInRow) {
			positionInRow = remainingPlayers;
			break;
		}
		remainingPlayers -= playersInRow;
		row++;
	}

	const y = 85 - (85 / rows) * (row + 1);
	const playersInRow = row === 0 ? 1 : formationDigits[row - 1];
	const x = (86 / (playersInRow + 1)) * positionInRow;

	return { x, y };
}