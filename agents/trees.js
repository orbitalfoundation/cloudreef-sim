

const db = globalThis.db

const layers = globalThis.layers
const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain')

function getLandPositions(threshold = 10) {

    const positions = [];

    for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {
            const y = layer[x+z*height]
            if (y > threshold) {
                positions.push({ x: x - width/2, y:y, z:z - height/2 });
            }
        }
    }

    return positions;
}


function placeTrees(numTrees = 100) {
    const landPositions = getLandPositions()

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

