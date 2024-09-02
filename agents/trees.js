

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
        };

        db.addEntity(treeEntity);
    }
}

const terrain = globalThis.terrain

function visualizeTrees(scene, db) {
    const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Forest green
    const treeGeometry = new THREE.CylinderGeometry(0.5, 2, 5, 8); // Simple cylinder for tree trunk

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'tree') {
            const node = new THREE.Mesh(treeGeometry, treeMaterial);
            node.position.set(entity.position.x,entity.position.y,entity.position.z)
            terrain.add(node);
            entity.node = node
        }
    });
}

placeTrees()
visualizeTrees(scene,db)

