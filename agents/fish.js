
const layers = globalThis.layers
const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain')
const terrain = globalThis.terrain
const db = globalThis.db

function place(num = 50) {

    const positions = db.getPositionsWithinElevationRange(1, 9);

    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const position = positions[randomIndex];

        const entity = {
            uuid: `/fish/${i.toString().padStart(4, '0')}`,
            type: 'fish',
            position,
            waypoint: position,
            volume: {
                geometry: 'sphere',
                props: [1], 
                material: { color: 0x00d700 } 
            }
        };

        db.addEntity(entity);
    }
}

place()

export function fishMovementSystem() {
    const maxHeadingChange = Math.PI / 4; // Maximum change in heading per update (radians)
    const speed = 0.5; // Speed of the fish
    const elevationLayer = 'terrain';

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

            // Ensure the fish stays within the water bounds
            const terrainHeight = layers.getAt(elevationLayer, Math.floor(newX + width / 2), Math.floor(newZ + height / 2));
            const newY = Math.max(terrainHeight + 1, entity.position.y); // Keep fish above the terrain and below the surface

            if (newX >= -width / 2 && newX < width / 2 && newZ >= -height / 2 && newZ < height / 2 && newY <= 0) {
                // Update position if within bounds
                entity.position = { x: newX, y: newY, z: newZ };
            }
        }
    });
}


globalThis.systems.push( fishMovementSystem )
