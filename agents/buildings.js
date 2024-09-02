

const layers = globalThis.layers
const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain')
const terrain = globalThis.terrain
const db = globalThis.db

function getShorelinePositions(minElevation = 10, maxElevation = 20) {
    const positions = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const z = layer[x+y*width]
            if (z > minElevation && z <= maxElevation) {
                positions.push({ x:x - width/2, y:z, z:y - height/2 });
            }
        }
    }

    return positions;
}


function placeBuildings(numBuildings = 50) {
    const shorelinePositions = getShorelinePositions();

    for (let i = 0; i < numBuildings; i++) {
        const randomIndex = Math.floor(Math.random() * shorelinePositions.length);
        const position = shorelinePositions[randomIndex];

        const buildingEntity = {
            uuid: `/building/${i.toString().padStart(4, '0')}`,
            type: 'building',
            position
        };

        db.addEntity(buildingEntity);
    }
}

placeBuildings()

function visualizeBuildings() {
    const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // SaddleBrown for buildings
    const buildingGeometry = new THREE.BoxGeometry(3, 5, 3); // Simple box for building

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'building') {
            const node = new THREE.Mesh(buildingGeometry, buildingMaterial);
            node.position.set(entity.position.x,entity.position.y,entity.position.z)
            terrain.add(node);
            entity.node = node
        }
    });
}

visualizeBuildings()


