
const config = globalThis.config
const size = globalThis.config.size
const waterLevel = globalThis.config.waterLevel

export const oceanEntity = {
	uuid: '/ocean',
	ocean: true,
	volume: {
		geometry: 'plane',
		props: [size, size],
		pose: {
			rotation: { x: Math.PI/2, y: 0, z: 0},
			position: { x: size/2, y: waterLevel, z: size/2 },
		},
		material: {
			color: 0x1e90ff, // Ocean color (DeepSkyBlue)
			opacity: 0.5,
			transparent: true,
			side: THREE.DoubleSide
		}
	}
}

