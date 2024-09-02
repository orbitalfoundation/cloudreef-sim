

const layers = globalThis.layers
const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain')
const terrain = globalThis.terrain
const db = globalThis.db

function getShorelinePositions(minElevation = 7, maxElevation = 9) {
    const positions = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const z = layer[x+y*width]
            if (z > minElevation && z <= maxElevation) {
                positions.push({ x:x - width/2, y:10, z:y - height/2 });
            }
        }
    }

    return positions;
}


function place(num = 50) {
    const shorelinePositions = getShorelinePositions();

    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * shorelinePositions.length);
        const position = shorelinePositions[randomIndex];

        const entity = {
            uuid: `/boat/${i.toString().padStart(4, '0')}`,
            type: 'boat',
            position,
            waypoint: position,
        };

        db.addEntity(entity);
    }
}

place()

function show() {
    const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x444488 }); // blue for boat
    const buildingGeometry = new THREE.BoxGeometry(3, 5, 3); // Simple box for building

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            const node = new THREE.Mesh(buildingGeometry, buildingMaterial);
            node.position.set(entity.position.x,entity.position.y,entity.position.z)
            terrain.add(node);
            entity.node = node
        }
    });
}

show()




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
    let possibleLocations = [];

    for (let y = -maxDistance; y <= maxDistance; y++) {
        for (let x = -maxDistance; x <= maxDistance; x++) {
            const nx = currentPosition.x + x;
            const nz = currentPosition.z + y;
            if (nx >= 0 && nx < width && nz >= 0 && nz < height) {
                const elevation = 0 //layer[nx + width / 2, nz + height / 2);
                if (elevation <= 0) { // Below water
                    possibleLocations.push({ x: nx, y: currentPosition.y, z: nz });
                }
            }
        }
    }

    if (possibleLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleLocations.length);
        return possibleLocations[randomIndex];
    }

    return null; // No suitable location found
}



globalThis.systems.push( boatSystem )

