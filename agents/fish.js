export const fishEmitter = {
    uuid: `/emitter/fish_emitter`,
    type: 'emitter',
    minElevation: 1,
    maxElevation: 9,
    quantity: 500,
    spawn: {
        type: 'fish',
        volume: {
            geometry: 'sphere',
            props: [1],
            material: { color: 0xff0000 }
        }
    }
};

export function fishMovementSystem(state) {
    const maxHeadingChange = Math.PI / 4; // Maximum change in heading per update (radians)
    const speed = 0.5; // Speed of the fish
    const width = globalThis.config.width;
    const height = globalThis.config.height;
    const terrain = globalThis.layers.get('terrain');
    const waterLevel = globalThis.config.waterLevel;

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'fish') {
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
                newX = Math.max(0, Math.min(newX, width - 1));
                newZ = Math.max(0, Math.min(newZ, height - 1));

                const terrainHeight = terrain[Math.floor(newZ) * width + Math.floor(newX)];

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

            // If no valid move found after 8 attempts, fish stays in place
            if (!validMove) {
                console.log("Fish couldn't find a valid move");
            }
        }
    });
}

