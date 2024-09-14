
const waterLevel = globalThis.config.waterLevel

const phytoplankton = {
	phytoplankton: true,
	volume: {
		geometry: 'sphere',
		material: { color: 'green' },
		whd: [3,3,3]
	}
}

export const phytoplankton_spawner = {
	uuid: `/agents/phytoplankton_spawner`,
	volume: {
		geometry: 'cube',
		material: { color: 'black' },
		whd: [10,10,10]
	},
	emitter: {
		range: [ 0, waterLevel -1 ],
		rate: 10, // per day
		quantity: 500, // maximum permitted to exist
		filter: { phytoplankton: true },
		spawn: phytoplankton
	},
}
