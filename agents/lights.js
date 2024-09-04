
export const directionalLight = {
	uuid: '/light/directional',
	type: 'directionalLight',
	position: { x: 1, y: 1, z: 1 },
	volume: {
		geometry: 'directionalLight',
		lightType: 'directional',
		color: 0xffffff,
		intensity: 1,
	}
};

export const ambientLight = {
	uuid: '/light/ambient',
	type: 'ambientLight',
	position: { x: 1, y: 1, z: 1 },
	volume: {
		geometry: 'ambientLight',
		lightType: 'ambient',
		color: 0x404040,
		intensity: 1,
		position: { x: 0, y: 0, z: 0 }
	}
};

export const sunLight = {
	uuid: '/light/sun',
	type: 'pointLight',
	position: { x: 100, y: 100, z: 0 },
	volume: {
		geometry: 'pointLight',
		lightType: 'point',
		color: 0xffffff,
		intensity: 1,
		distance: 500,
		decay: 2
	}
};

export function sunSystem() {
	const sunEntity = globalThis.db.getEntity('/light/sun');
	if (!sunEntity) return;

	const time = globalThis.time;
	const radius = 200;
	const speed = 0.001;
	const angle = time.seconds * speed;

	sunEntity.position.x = Math.cos(angle) * radius;
	sunEntity.position.z = Math.sin(angle) * radius;
	sunEntity.position.y = Math.abs(Math.sin(angle)) * radius + 50;

	globalThis.db.addEntity(sunEntity);
}
