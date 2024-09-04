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
        birthTick: 0,
        birthDay: 0,
        birthYear: 0,
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
            // Set birth information for new entities
            if (entity.birthYear === undefined) {
                entity.birthTick = state.tick;
                entity.birthDay = state.daysPassed;
                entity.birthYear = state.yearsPassed;
            }

            // Calculate age in years
            const age = state.yearsPassed - entity.birthYear + 
                        (state.daysPassed - entity.birthDay) / state.daysPerYear +
                        (state.tick - entity.birthTick) / (state.ticksPerDay * state.daysPerYear);

            // Delete people over 30 years old
            if (age > 30) {
                db.removeEntity(entity.uuid);
                return;
            }

            // People less than 10 years old don't move
            if (age < 10) {
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


