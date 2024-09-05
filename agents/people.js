
const db = globalThis.db;
const config = globalThis.config;
const time = globalThis.time;
const peopleElevation = 2.5;

function observer(blob) {

    if(!blob.tick) return

    Object.values(db.entities).forEach(entity => {
        if (!entity.people) return

        // People less than 10 years old don't move
        if (entity.createdAt + config.secondsPerYear * 10 > config.seconds ) {
            return;
        }

        // Mark people over 30 for deletion
        if (entity.createdAt + config.secondsPerYear * 30 < config.seconds) {
            entity.obliterate = true
            return;
        }

        if (time.secondOfDay === time.morningSeconds) {
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
        } else if (time.secondOfDay === time.eveningSeconds) {
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
    });
}

export const people = {
    uuid: `/agents/people`,
    emitter: {
        minElevation: config.waterLevel,
        maxElevation: Infinity,
        quantity: 10, // Total number of people to generate
        spawn: {
            people: true,
            volume: { 
                geometry: 'sphere', 
                props: [1], 
                material: { color: 'gold' } 
            },
        }
    },
    observer
}
