

const db = globalThis.db

function placePeople(minPeople = 1, maxPeople = 4) {
    const buildings = Object.values(db.entities).filter(entity => entity.type === 'building');

    buildings.forEach((building, index) => {
        const numPeople = Math.floor(Math.random() * (maxPeople - minPeople + 1)) + minPeople;

        for (let i = 0; i < numPeople; i++) {
            const personEntity = {
                uuid: `/person/${index.toString().padStart(4, '0')}_${i}`,
                type: 'person',
                home: building.uuid, // Link person to their home building
                position: { 
                    x: building.position.x, 
                    y: building.position.y + 2.5, // Adjust to place on top of the building
                    z: building.position.z 
                },
                volume: {
                    geometry: 'sphere',
                    props: [1], // Radius of 1
                    material: { color: 0xffd700 } // Gold color for people
                }
            };

            db.addEntity(personEntity);
        }
    });
}

placePeople()

function peopleSystem(state) {

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'person') {
            if (state.tick === state.morningTick) {
                // Find the nearest boat
                const nearestBoat = findNearestBoat(entity.position);
                console.log("moving people",entity,nearestBoat)
                if (nearestBoat) {
                    entity.position = { ...nearestBoat.position }; // Move to the boat
                }
            } else if (state.tick === state.eveningTick) {
                // Move back home
                const homeBuilding = db.getEntity(entity.home);
                if (homeBuilding) {
                    entity.position = { ...homeBuilding.position };
                }
            }
        }
    });
}

function findNearestBoat(personPosition) {
    let nearestBoat = null;
    let minDistance = Infinity;

    Object.values(db.entities).forEach(entity => {
        if (entity.type === 'boat') {
            const distance = Math.sqrt(
                Math.pow(personPosition.x - entity.position.x, 2) +
                Math.pow(personPosition.z - entity.position.z, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestBoat = entity;
            }
        }
    });

    return nearestBoat;
}



globalThis.systems.push( peopleSystem )


