const db = globalThis.db;
const config = globalThis.config;
const peopleElevation = 2.5;

export const peopleEmitter = {
    uuid: `/emitter/people_emitter`,
    type: 'emitter',
    minElevation: config.waterLevel,
    maxElevation: Infinity,
    quantity: 10, // Total number of people to generate
    spawn: {
        type: 'person',
        age: 0, // Start with age 0
        volume: {
            geometry: 'sphere',
            props: [1], // Radius of 1
            material: { color: 0xffd700 } // Gold color for people
        }
    }
};

export function peopleSystem(state) {
    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'person') {
            // Increment age every day
            if (state.tick === 0) {
                entity.age = (entity.age || 0) + 1;
            }

            // Delete people over 30 years old
            if (entity.age > 30) {
                db.removeEntity(entity.uuid);
                return;
            }

            // People less than 10 years old don't move
            if (entity.age < 10) {
                return;
            }

            if (state.tick === state.morningTick) {
                // Find the nearest boat
                const nearestBoat = db.findNearestEntityOfType(entity.position, 'boat');
                if (nearestBoat) {
                    entity.position = { 
                        x: nearestBoat.position.x, 
                        y: nearestBoat.position.y + peopleElevation, 
                        z: nearestBoat.position.z 
                    };
                } else {
                    console.error("No boat found for person");
                }
            } else if (state.tick === state.eveningTick) {
                // Find the nearest building
                const nearestBuilding = db.findNearestEntityOfType(entity.position, 'building');
                if (nearestBuilding) {
                    entity.position = { 
                        x: nearestBuilding.position.x, 
                        y: nearestBuilding.position.y + peopleElevation, 
                        z: nearestBuilding.position.z 
                    };
                } else {
                    console.error("No building found for person");
                }
            }
        }
    });
}


