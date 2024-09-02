const db = globalThis.db;

function createEmitter(props) {
    const emitterEntity = {
        uuid: `/emitter/${props.id}`,
        type: 'emitter',
        minElevation: props.minElevation,
        maxElevation: props.maxElevation,
        spawn: props.spawn,
        latch: false
    };
    db.addEntity(emitterEntity);
}

function emitterSystem(state) {
    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'emitter' && !entity.latch) {
            const positions = db.getPositionsWithinElevationRange(entity.minElevation, entity.maxElevation);
            
            if (positions.length > 0) {
                const randomIndex = Math.floor(Math.random() * positions.length);
                const position = positions[randomIndex];

                const spawnedEntity = {
                    ...entity.spawn,
                    position: position,
                    uuid: `${entity.spawn.type}/${db.getEntitiesByType(entity.spawn.type).length}`
                };

                db.addEntity(spawnedEntity);
                entity.latch = true;
            }
        }
    });
}

// Example usage:
createEmitter({
    id: 'tree_emitter',
    minElevation: 10,
    maxElevation: 20,
    spawn: {
        type: 'tree',
        volume: { 
            geometry: 'cylinder', 
            props: [0.5, 2, 5, 8], 
            material: { color: 0x228B22 } 
        }
    }
});

globalThis.systems.push(emitterSystem);
