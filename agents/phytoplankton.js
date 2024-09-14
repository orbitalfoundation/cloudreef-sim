
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
	emitter: {
		range: [ 0, waterLevel -1 ],
		quantity: 500,
		spawn: phytoplankton
	}
}
