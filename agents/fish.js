export const fishEmitter = {
    uuid: `/emitter/fish_emitter`,
    type: 'emitter',
    minElevation: 1,
    maxElevation: 9,
    quantity: 50,
    spawn: {
        type: 'fish',
        volume: {
            geometry: 'sphere',
            props: [1],
            material: { color: 0x00d700 }
        }
    }
};

 function fishMovementSystem(state) {
    const maxHeadingChange = Math.PI / 4; // Maximum change in heading per update (radians)
    const speed = 0.5; // Speed of the fish
    const width = globalThis.config.width
    const height = globalThis.config.height
    const terrain = glbalThis.layers[globalThis.config.terrain]

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

            // Calculate the new position based on the heading
            const newX = entity.position.x + Math.cos(entity.heading) * speed;
            const newZ = entity.position.z + Math.sin(entity.heading) * speed;

            // quick hack - stay in range - this code could be improved using modulo
            while(newX < 0) newX += width
            while(newZ < 0) newZ += height
            while(newX >= width) newX -= width
            while(newZ >= height) newZ -= height

            // Layer data is ranged from 0-width and 0-height even though the visualization is centered at the origin
            // Find elevation at this point and make sure the fish stays above the terrain and below the surface

            const layerX = Math.floor(newX + width / 2)
            const layerY = Math.floor(newZ + height / 2)
            const terrainHeight = layers.getAt(elevationLayer, layerX, layerY );
            const newY = Math.max(terrainHeight + 1, entity.position.y);

            // Update position if within bounds
            if (newX >= -width / 2 && newX < width / 2 && newZ >= -height / 2 && newZ < height / 2 && newY <= 0) {
                entity.position = { x: newX, y: newY, z: newZ };
            }
        }
    });
}

