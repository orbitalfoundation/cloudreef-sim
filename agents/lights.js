
const config = globalThis.config
const width = config.width
const height = config.height

export const directionalLight = {
	uuid: '/light/directional',
	type: 'directionalLight',
	position: { x: width/2 , y: 100, z: height/2 },
	rotation: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'directionalLight',
		color: 0xffffff,
		intensity: 0.5,
        material: {
            color: 0xffff00,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        }
	}
};

export const ambientLight = {
	uuid: '/light/ambient',
	type: 'ambientLight',
	position: { x: width/2, y: 0, z: height/2 },
	volume: {
		geometry: 'ambientLight',
		color: 0xffffff,
		intensity: 0.5,
        material: {
            color: 0xffff00,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        }
	}
};

export const sunLight = {
	uuid: '/light/sun',
	type: 'pointLight',
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'pointLight',
		color: 0xffffff,
		intensity: 0.1,
		distance: 512,
		decay: 2,
        material: {
            color: 0xffff00,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        }
	}
};

const time = globalThis.time

export function sunSystem() {

	const entity = globalThis.db.getEntity('/light/sun')
	if (!entity) return

	const radius = config.width
	const angle = time.secondOfDay / time.secondsPerDay * Math.PI

	entity.position.x = Math.cos(angle) * radius + radius / 2
	entity.position.y = Math.sin(angle) * radius - radius / 2
	entity.position.z = radius / 2

}

