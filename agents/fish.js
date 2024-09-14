
const waterLevel = globalThis.config.waterLevel

const fish = {
	fish: {
		species: 'tuna',
	},
	organism: {
		range: [0, waterLevel-1 ],
		searchRadius: 1000,
		consumes: 'phytoplankton',
		spawnHints: {
			fish: {
				species: 'tuna',
			},
			volume: {
				geometry: 'sphere',
				material: { color: 'black' },
				whd: [3,3,3]
			}			
		}
	},
	volume: {
		geometry: 'sphere',
		material: { color: 'black' },
		whd: [3,3,3]
	}
}

export const fish_spawner = {
	uuid: `/agents/fishes`,
	emitter: {
		range: [ 0, waterLevel-1 ],
		quantity: 1,
		spawn: fish
	}
}






