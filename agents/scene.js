
const size = globalThis.config.size

// @todo camera

export const scene = {
	uuid:'/agents/scene',
	volume: {
		geometry: 'scene',
		near: 1,
		far: size*2,
		cameraPosition:[size/2,size/2,size],
		cameraTarget:[size/2,0,size/2],
		cameraMin: 1,
		cameraMax: size
	}
}
