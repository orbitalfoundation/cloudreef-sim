
const config = globalThis.config
const width = config.width
const height = config.height

function observer(blob) {

	if(!blob.tick) return
	const time = blob.time

	const entity = globalThis.db.getEntity('/light/sun')
	if (!entity || !entity.node) return

	const radius = config.width
	const angle = time.secondOfDay / time.secondsPerDay * Math.PI * 2 - Math.PI / 2 // get the sun in the correct position for morning

	entity.node.position.x = entity.position.x = Math.cos(angle) * radius / 2 + radius / 2
	entity.node.position.y = entity.position.y = Math.sin(angle) * radius / 2
	entity.node.position.z = entity.position.z = radius / 2

}

export const sunLight = {
	uuid: '/light/sun',
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'pointLight',
		color: 0xffffff,
		intensity: 1,
		distance: 512,
		decay: 2,
		material: {
			kind: 'basic',
			color: 0xffff00,
		}
	},
	observer
}

 const directionalLight = {
	uuid: '/light/directional',
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
}

export const ambientLight = {
	uuid: '/light/ambient',
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
}
