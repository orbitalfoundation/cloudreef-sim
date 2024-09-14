
const waterLevel = globalThis.config.waterLevel
const size = globalThis.config.size

const maxHeadingChange = Math.PI / 4; // Maximum change in heading per update (radians)
const speed = 0.5; // Speed of the fish

function resolve(blob) {

	if(!blob.time) return

	const sys = blob._sys
	const volume = sys.volume

	const terrain = volume.terrain() // @todo hack

	const callback = (entity) => {
 
		// Initialize heading if it doesn't exist
		if (!entity.heading) {
			entity.heading = Math.random() * 2 * Math.PI; // Random initial heading
		}

		// Randomly adjust heading
		if (Math.random() < 0.1) { // 10% chance to change heading each tick
			entity.heading += (Math.random() - 0.5) * maxHeadingChange;
		}

		let attempts = 0;
		let validMove = false;

		while (!validMove && attempts < 8) {
			// Calculate the new position based on the heading
			let newX = entity.position.x + Math.cos(entity.heading) * speed;
			let newZ = entity.position.z + Math.sin(entity.heading) * speed;

			// Ensure newX and newZ stay within bounds
			newX = Math.max(0, Math.min(newX, size - 1));
			newZ = Math.max(0, Math.min(newZ, size - 1));

			const terrainHeight = terrain[Math.floor(newZ) * size + Math.floor(newX)];

			// Check if the new position is valid (above terrain and below water level)
			if (terrainHeight < waterLevel) {
				const newY = Math.max(terrainHeight + 1, Math.min(entity.position.y, waterLevel - 1));
				entity.position = { x: newX, y: newY, z: newZ };
				validMove = true;
			} else {
				// If the move is invalid, change direction and try again
				entity.heading = (entity.heading + Math.PI / 4) % (2 * Math.PI);
				attempts++;
			}

		}
	}

	volume.query({filter:{fish:true},callback})

}

const fish = {
	fish: true,
	volume: { 
		geometry: 'sphere',
		material: { color: 0xC0C0C0 }  // Silver color
	}
}

export const fish_spawner = {
	uuid: `/agents/fish`,
	resolve,
	emitter: {
		minElevation: 0,
		maxElevation: globalThis.config.waterLevel - 1,
		quantity: 500,
		spawn: fish
	}
}






