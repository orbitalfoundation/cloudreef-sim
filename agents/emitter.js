const db = globalThis.db;

function emitterSystem(state) {
    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'emitter' && !entity.latch) {
            entity.latch = true;

            let positions = [];

            if (entity.targetEntityType) {
                const targetEntities = db.getEntitiesByType(entity.targetEntityType);
                positions = targetEntities.map(targetEntity => targetEntity.position);
            } else {
                positions = db.getPositionsWithinElevationRange(entity.minElevation, entity.maxElevation);
            }

            if (positions.length < 1) return;

            for (let i = 0; i < entity.quantity; i++) {
                const randomIndex = Math.floor(Math.random() * positions.length);
                const position = positions[randomIndex];

                const spawnedEntity = {
                    ...entity.spawn,
                    position: position,
                    uuid: `${entity.spawn.type}/${db.getEntitiesByType(entity.spawn.type).length}`
                };

                db.addEntity(spawnedEntity);
            }
        }
    });
}

globalThis.systems.push(emitterSystem);




