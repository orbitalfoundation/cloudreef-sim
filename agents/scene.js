
const size = globalThis.config.size

export const aaa_scene = {
	uuid:'/agents/scene',
	volume: {
		geometry: 'scene',
		near: 1,
		far: size*4,
	}
}

export const aab_camera001 = {
	volume: {
		geometry: 'camera',
		cameraMin: 1,
		cameraMax: size*2,
		pose:{
			position:[size/2,size/2,size],
			love:[size/2,0,size/2]
		}
	}
}

