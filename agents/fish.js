
const waterLevel = globalThis.config.waterLevel

const fish = {
	fish: {
		species: 'tuna',
	},
	organism: {
		range: [0, waterLevel-1 ],
		searchRadius: 20,
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
	volume: {
		geometry: 'cube',
		material: { color: 'black' },
		whd: [10,10,10]
	},
	emitter: {
		range: [ 0, waterLevel-1 ],
		quantity: 10,
		spawn: fish
	}
}






