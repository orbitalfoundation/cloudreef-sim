const db = globalThis.db

function placeBuildings(numBuildings = 50) {
    const shorelinePositions = db.getPositionsWithinElevationRange(10, 20);

    for (let i = 0; i < numBuildings; i++) {
        const randomIndex = Math.floor(Math.random() * shorelinePositions.length);
        const position = shorelinePositions[randomIndex];

        const buildingEntity = {
            uuid: `/building/${i.toString().padStart(4, '0')}`,
            type: 'building',
            position,
            volume: {
                geometry: 'box',
                props: [3, 5, 3],
                material: { color: 0x8B4513 } // SaddleBrown for buildings
            }
        };

        db.addEntity(buildingEntity);
    }
}

placeBuildings()

function buildingsSystem(state) {
    // This function can be used for any building-related logic in the future
    // For now, it's empty as buildings don't have any specific behavior
}

globalThis.systems.push(buildingsSystem);

