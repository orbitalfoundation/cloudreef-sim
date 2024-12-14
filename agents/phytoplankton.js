
const waterLevel = globalThis.config.waterLevel

// what to spawn

const phytoplankton = {
	phytoplankton: true,
	volume: {
		geometry: 'sphere',
		material: { color: 'green' },
		pose: { scale: {x:3, y:3, z:3 } }
	}
}

// a spawner - represented by a cube
// @todo why at bottom ?

export const phytoplankton_spawner = {
	uuid: `/agents/phytoplankton_spawner`,
	volume: {
		geometry: 'cube',
		material: { color: 'black' },
		pose: { scale: {x:10,y:10,z:10} }
	},
	emitter: {
		range: [ 0, waterLevel -1 ],
		rate: 10, // per day
		quantity: 500, // maximum permitted to exist
		filter: { phytoplankton: true },
		spawn: phytoplankton
	},
}
