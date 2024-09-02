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

function boatSystem(state) {
    const config = globalThis.config;
    const startFishingTick = state.morningTick + 20;
    const returnHomeTick = state.eveningTick - 20;

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            if (state.tick === startFishingTick) {
                // Move to a random nearby location with low elevation (boats are always at water level which is hardcoded to 10 for now)
                const newLocation = { x: entity.position.x + Math.random()*4 - 2,y:10,z: entity.position.z + Math.random()*4 -2 }
                if (newLocation) {
                    entity.position = { ...newLocation };
                }
            } else if (state.tick === returnHomeTick) {
                // Move back to the starting waypoint
                if (entity.waypoint) {
                    entity.position = { ...entity.waypoint };
                }
            }
        }
    });

}

// fix @todo

function findRandomWaterLocation(currentPosition) {
    const maxDistance = 20; // Limit search radius for nearby water locations
    const waterPositions = db.getPositionsWithinElevationRange(-Infinity, 0);
    
    const nearbyWaterPositions = waterPositions.filter(pos => 
        Math.abs(pos.x - currentPosition.x) <= maxDistance &&
        Math.abs(pos.z - currentPosition.z) <= maxDistance
    );

    if (nearbyWaterPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * nearbyWaterPositions.length);
        return nearbyWaterPositions[randomIndex];
    }

    return null; // No suitable location found
}



globalThis.systems.push( boatSystem )

