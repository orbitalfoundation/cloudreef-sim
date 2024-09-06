
const config = globalThis.config
const width = config.width
const height = config.height

function observer(blob) {
	if(!blob.tick) return
	const time = blob.time

	const sunEntity = globalThis.db.getEntity('/light/sun')
	const moonEntity = globalThis.db.getEntity('/light/moon')
	if (!sunEntity || !sunEntity.node || !moonEntity || !moonEntity.node) return

	const radius = config.width
	const sunAngle = time.secondOfDay / time.secondsPerDay * Math.PI * 2 - Math.PI / 2
	const moonAngle = sunAngle + Math.PI // Moon is opposite to the sun

	// Update sun position
	sunEntity.node.position.x = sunEntity.position.x = Math.cos(sunAngle) * radius / 2 + radius / 2
	sunEntity.node.position.y = sunEntity.position.y = Math.sin(sunAngle) * radius / 2
	sunEntity.node.position.z = sunEntity.position.z = radius / 2

	// Update moon position
	moonEntity.node.position.x = moonEntity.position.x = Math.cos(moonAngle) * radius / 2 + radius / 2
	moonEntity.node.position.y = moonEntity.position.y = Math.sin(moonAngle) * radius / 2
	moonEntity.node.position.z = moonEntity.position.z = radius / 2

	// Adjust light intensities based on time of day
	const dayProgress = (sunAngle + Math.PI / 2) / (Math.PI * 2)
	sunEntity.volume.intensity = Math.sin(dayProgress * Math.PI)
	moonEntity.volume.intensity = Math.sin((dayProgress + 0.5) * Math.PI) * 0.3 // Moon is dimmer
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

export const moonLight = {
	uuid: '/light/moon',
	position: { x: 0, y: 0, z: 0 },
	volume: {
		geometry: 'pointLight',
		color: 0xaaaaff, // Slightly blue tint for moonlight
		intensity: 0.3,
		distance: 512,
		decay: 2,
		material: {
			kind: 'basic',
			color: 0xaaaaff,
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
		intensity: 0.2, // Reduced intensity to account for moon light
		material: {
			color: 0xffff00,
			opacity: 0.5,
			transparent: true,
			side: THREE.DoubleSide
		}
	}
}
