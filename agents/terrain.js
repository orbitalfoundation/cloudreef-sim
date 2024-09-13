
const size = globalThis.config.size

export const entity = {
	uuid: '/agents/terrain',
	terrain: true,
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'layer',
		size,
		props: [size, size, size - 1, size - 1],
		material: { color: 0xd3b683, wireframe: false },
	}
}

