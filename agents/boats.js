

const scene = globalThis.scene
const terrain = globalThis.terrain
const db = globalThis.db

function place(num = 50) {
    const shorelinePositions = db.getPositionsWithinElevationRange(7, 9);

    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * shorelinePositions.length);
        const position = shorelinePositions[randomIndex];

        const entity = {
            uuid: `/boat/${i.toString().padStart(4, '0')}`,
            type: 'boat',
            position,
            waypoint: position,
            volume: { geometry: 'box', whd: [1, 1, 1], material: { color: '0x0000ff' } }
        };

        db.addEntity(entity);
    }
}

place()

function boatSystem(state) {
    const startFishingTick = state.morningTick + 20;
    const returnHomeTick = state.eveningTick - 20;

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            if (state.tick === startFishingTick) {
                // Move to a random nearby location with low elevation (below water)
                const newLocation = { x: entity.position.x + Math.random()*4 - 2,y:10,z: entity.position.z + Math.random()*4 -2 } // findRandomWaterLocation(entity.position);
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

