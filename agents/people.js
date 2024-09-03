const db = globalThis.db;
const config = globalThis.config;
const peopleElevation = 2.5;

export const peopleEmitter = {
    uuid: `/emitter/people_emitter`,
    type: 'emitter',
    minElevation: config.waterLevel,
    maxElevation: Infinity,
    quantity: 100, // Total number of people to generate
    spawn: {
        type: 'person',
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


