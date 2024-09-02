const db = globalThis.db;
const peopleElevation = 2.5;

export const peopleEmitter = {
    uuid: `/emitter/people_emitter`,
    type: 'emitter',
    targetEntityType: 'building',
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
    // Assign homes to people who don't have one
    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'person' && !entity.home) {
            const buildings = db.getEntitiesByType('building');
            if (buildings.length > 0) {
                const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];
                entity.home = randomBuilding.uuid;
                entity.position = {
                    x: randomBuilding.position.x,
                    y: randomBuilding.position.y + peopleElevation,
                    z: randomBuilding.position.z
                };
            }
        }
    });
    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'person') {
            if (state.tick === state.morningTick) {
                // Find the nearest boat using DB function
                const nearestBoat = db.findNearestEntityOfType(entity.position, 'boat');
                if (nearestBoat) {
                    entity.position = { ...nearestBoat.position }; // Move to the boat
                } else {
                    console.error("no boat")
                }
            } else if (state.tick === state.eveningTick) {
                // Move back home
                const homeBuilding = db.getEntity(entity.home);
                if (homeBuilding) {
                    entity.position = { ...homeBuilding.position };
                    entity.position.y += peopleElevation
                }
            }
        }
    });
}


