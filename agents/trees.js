
const waterLevel = globalThis.config.waterLevel

const tree = {
	tree: true,
	volume: { 
		geometry: 'cylinder', 
		props: [0.5, 2, 5, 8], 
		material: { color: 0x228B22 } 
	},
}

export const tree_spawner = {
	uuid: `/agents/trees`,
	emitter: {
		range:[ waterLevel + 5, Infinity ],
		quantity: 200,
		spawn: tree
	}
}
