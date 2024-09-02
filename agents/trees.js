

const db = globalThis.db

function placeTrees(numTrees = 100) {
    const landPositions = db.getLandPositions()

    for (let i = 0; i < numTrees; i++) {
        const randomIndex = Math.floor(Math.random() * landPositions.length);
        const position = landPositions[randomIndex];

position.y += 5

        const treeEntity = {
            uuid: `/tree/${i.toString().padStart(4, '0')}`,
            type: 'tree',
            position,
            volume: { 
                geometry: 'cylinder', 
                props: [0.5, 2, 5, 8], 
                material: { color: 0x228B22 } 
            }
        };

        db.addEntity(treeEntity);
    }
}

placeTrees()

