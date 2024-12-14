
const waterLevel = globalThis.config.waterLevel

const buildings = {
	building: true,
	volume: {
		geometry: 'box',
		pose: { position:{x:0,y:0,z:0}, scale: {x:3,y:5,z:3 } },
		material: { color: 0x8B4513 }
	}
}

export const buildings_spawner = {
	uuid: `/emitter/buildings`,
	emitter: {
		range:[ waterLevel, waterLevel + 2 ],
		quantity: 50,
		spawn: buildings
	},
	volume: { // mandatory @todo fix
		geometry: 'cube',
		material: { color: 'black' },
		pose: { scale: {x:10,y:10,z:10} }
	}
}

