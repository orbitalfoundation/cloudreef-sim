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

export function boatSystem(state) {
    const config = globalThis.config;
    const startFishingTick = state.morningTick + 20;
    const returnHomeTick = state.eveningTick - 20;

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            if (!entity.waypoint) {
                entity.waypoint = { ...entity.position };
            }

            if (state.tick === startFishingTick) {
                // Move to a random nearby location
                const newLocation = findRandomWaterLocation(entity.position);
                if (newLocation) {
                    entity.position = { ...newLocation, y: config.waterLevel };
                }
            } else if (state.tick === returnHomeTick) {
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

