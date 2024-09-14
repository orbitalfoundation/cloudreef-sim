
const waterLevel = globalThis.config.waterLevel

const buildings = {
	building: true,
	volume: {
		geometry: 'box',
		whd: [3, 5, 3],
		material: { color: 0x8B4513 }
	}
}

export const buildings_spawner = {
	uuid: `/emitter/buildings`,
	emitter: {
		range:[ waterLevel, waterLevel + 2 ],
		quantity: 50,
		spawn: buildings
	}
}

