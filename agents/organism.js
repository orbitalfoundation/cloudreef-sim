
const xsize = globalThis.config.size
const zsize = globalThis.config.size

/**
 * Organism system
 *
 * Updates entity defined within an informal entity component system model.
 *
 * For example a typical entity consists of a hash of simple child json objects that act like components:
 *
 * const my_entity = {
 *   kind: 'fish',
 *   position: { x:0, y:0, z:0 },
 *   organism: {
 *     age: 1,
 *     mass: 0.1,
 *     energy: 1.0,
 *     rested: 1.0,
 *     speed: 0.5,
 *     heading: 0.0,
 *     gestation: 0.0,
 *     womb: true,
 *     range: [0, waterLevel-1],
 *     maxSpeed: 1,
 *     maxHeadingChange: Math.PI / 4,
 *     gestationRate: 0.05,
 *     energyThreshold: 0.3,
 *     reproductionThreshold: 0.8,
 *   }
 * }
 */

function organisms_system(blob) {
    if (!blob.time) return
    const sys = blob._sys
    const volume = sys.volume
    const terrain = volume.terrain()

    const callback = (entity) => {
        const organism = entity.organism
        const maxHeadingChange = organism.maxHeadingChange
        const speed = organism.speed

        // 1) If energy is zero then do nothing (is dead and external code will cleanup)
        if (organism.energy <= 0) {
            return
        }

        // 2) If energy is low then query for any nearby food and move towards nearest if any else move randomly
        if (organism.energy < organism.energyThreshold) {
            const nearbyFood = findNearbyFood(entity, volume)
            if (nearbyFood) {
                moveTowardsFood(entity, nearbyFood)
            } else {
                moveRandomly(entity, organism, maxHeadingChange, speed)
            }
        } else {
            // 3) If energy is high and has a womb and not gestating then may begin gestation
            if (organism.energy > organism.reproductionThreshold && organism.womb && organism.gestation === 0) {
                if (Math.random() < 0.1) { // 10% chance to start gestation
                    organism.gestation = 0.01
                } else {
                    moveRandomly(entity, organism, maxHeadingChange, speed)
                }
            } else {
                moveRandomly(entity, organism, maxHeadingChange, speed)
            }
        }

        // Update organism state
        organism.energy -= 0.01 // Decrease energy over time
        organism.age += 0.01 // Increase age
        if (organism.gestation > 0) {
            organism.gestation += organism.gestationRate
            if (organism.gestation >= 1) {
                reproduceOrganism(entity, sys)
            }
        }
    }

    volume.query({filter:{organism:true}, callback})
}

function findNearbyFood(entity, volume) {
    let nearestFood = null
    let minDistance = Infinity

    volume.query({
        position: entity.position,
        radius: 10, // Adjust search radius as needed
        filter: {food: true},
        callback: (food) => {
            const distance = calculateDistance(entity.position, food.position)
            if (distance < minDistance) {
                minDistance = distance
                nearestFood = food
            }
        }
    })

    return nearestFood
}

function moveTowardsFood(entity, food) {
    const dx = food.position.x - entity.position.x
    const dz = food.position.z - entity.position.z
    entity.organism.heading = Math.atan2(dz, dx)
    moveEntity(entity)
}

function moveRandomly(entity, organism, maxHeadingChange, speed) {
    if (!organism.heading) {
        organism.heading = Math.random() * 2 * Math.PI
    }
    if (Math.random() < 0.1) {
        organism.heading += (Math.random() - 0.5) * maxHeadingChange
    }
    moveEntity(entity)
}

function moveEntity(entity) {
    const organism = entity.organism
    const speed = organism.speed
    const minY = organism.range[0]
    const maxY = organism.range[1]

    for (let attempts = 0; attempts < 10; attempts++) {
        let newX = entity.position.x + Math.cos(organism.heading) * speed
        let newY = maxY
        let newZ = entity.position.z + Math.sin(organism.heading) * speed

        newX = Math.max(0, Math.min(newX, xsize - 1))
        newZ = Math.max(0, Math.min(newZ, zsize - 1))

        const terrainHeight = terrain[Math.floor(newZ) * zsize + Math.floor(newX)]

        if (terrainHeight >= minY && terrainHeight <= maxY) {
            entity.position = { x: newX, y: newY, z: newZ }
            break
        } else {
            organism.heading += (Math.random() - 0.5) * organism.maxHeadingChange
        }
    }
}

function reproduceOrganism(parent, sys) {
    const childOrganism = JSON.parse(JSON.stringify(parent.organism))
    childOrganism.age = 0
    childOrganism.energy = 0.5
    childOrganism.gestation = 0

    const childEntity = {
        ...parent,
        organism: childOrganism,
        position: {...parent.position},
        uuid: `${parent.uuid}/offspring/${Date.now()}`
    }

    sys.resolve(childEntity)

    parent.organism.gestation = 0
    parent.organism.energy *= 0.5
}

function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x
    const dz = pos1.z - pos2.z
    return Math.sqrt(dx * dx + dz * dz)
}

export const organisms = {
    resolve: organisms_system
}

