export const boatEmitter = {
    uuid: `/emitter/boat_emitter`,
    type: 'emitter',
    minElevation: 7,
    maxElevation: 9,
    quantity: 50,
    spawn: {
        type: 'boat',
        volume: { 
            geometry: 'box', 
            props: [3, 5, 3], 
            material: { color: 'blue' } 
        }
    }
};

const config = globalThis.config;
const time = globalThis.time;

export function boatSystem() {

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            if (!entity.waypoint) {
                entity.waypoint = { ...entity.position };
            }

            if (time.secondOfDay === time.morningSeconds + 3600) {
                // Move to a random nearby location
                if(!entity.fishingLocation) {
                    entity.fishingLocation = findRandomWaterLocation(entity.position);
                }
                if (entity.fishingLocation) {
                    entity.position = { ...entity.fishingLocation, y: config.waterLevel };
                }
            } else if (time.secondOfDay === time.eveningSeconds - 3600) {
                // Move back to the starting waypoint
                entity.position = { ...entity.waypoint, y: config.waterLevel };
            }
        }
    });
}

function findRandomWaterLocation(currentPosition) {
    const maxDistance = 20;
    const waterPositions = db.getPositionsWithinElevationRange(-Infinity, config.waterLevel);
    
    const nearbyWaterPositions = waterPositions.filter(pos => 
        Math.abs(pos.x - currentPosition.x) <= maxDistance &&
        Math.abs(pos.z - currentPosition.z) <= maxDistance
    );

    if (nearbyWaterPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * nearbyWaterPositions.length);
        return nearbyWaterPositions[randomIndex];
    }

    return null;
}

