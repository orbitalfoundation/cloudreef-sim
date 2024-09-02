export class DB {
    constructor() {
        this.entities = {}; // Object to store entities by UUID
        this.systems = []; // Array to store systems (functions that operate on entities)
    }

    // Add an entity to the database
    addEntity(entity) {
        if (!entity.uuid) {
            throw new Error("Entity must have a uuid");
        }
        this.entities[entity.uuid] = entity;
    }

    // Get an entity by UUID
    getEntity(uuid) {
        return this.entities[uuid] || null;
    }

    // Remove an entity by UUID
    removeEntity(uuid) {
        delete this.entities[uuid];
    }

    // Add a system to the database
    addSystem(system) {
        if (typeof system === 'function') {
            this.systems.push(system);
        } else {
            throw new Error("System must be a function");
        }
    }

    // Execute all systems
    runSystems(now) {
        for (const system of this.systems) {
            system(now);
        }
    }

    // Clear all entities
    clearEntities() {
        this.entities = {};
    }

    // Clear all systems
    clearSystems() {
        this.systems = [];
    }
}

/*

export class DB {
    constructor(layers, config) {
        this.entities = {}; // Object to store entities by UUID
        this.systems = []; // Array to store systems (functions that operate on entities)
        this.layers = layers;
        this.config = config;
    }

    // Add an entity to the database
    addEntity(entity) {
        if (!entity.uuid) {
            throw new Error("Entity must have a uuid");
        }
        this.entities[entity.uuid] = entity;
    }

    // Get an entity by UUID
    getEntity(uuid) {
        return this.entities[uuid] || null;
    }

    // Remove an entity by UUID
    removeEntity(uuid) {
        delete this.entities[uuid];
    }

    // Add a system to the database
    addSystem(system) {
        if (typeof system === 'function') {
            this.systems.push(system);
        } else {
            throw new Error("System must be a function");
        }
    }

    // Execute all systems
    runSystems(now) {
        for (const system of this.systems) {
            system(now);
        }
    }

    // Clear all entities
    clearEntities() {
        this.entities = {};
    }

    // Clear all systems
    clearSystems() {
        this.systems = [];
    }

    // Get positions within a certain elevation range
    getPositionsWithinElevationRange(minElevation, maxElevation) {
        const positions = [];
        const layer = this.layers.get('terrain');

        for (let y = 0; y < this.config.height; y++) {
            for (let x = 0; x < this.config.width; x++) {
                const z = layer[x + y * this.config.width];
                if (z > minElevation && z <= maxElevation) {
                    positions.push({ x: x - this.config.width / 2, y: z, z: y - this.config.height / 2 });
                }
            }
        }

        return positions;
    }

    // Get shoreline positions
    getShorelinePositions(minElevation = 7, maxElevation = 9) {
        return this.getPositionsWithinElevationRange(minElevation, maxElevation);
    }

    // Get land positions above a certain threshold
    getLandPositions(threshold = 10) {
        return this.getPositionsWithinElevationRange(threshold, Infinity);
    }

    // Get entities by type
    getEntitiesByType(type) {
        return Object.values(this.entities).filter(entity => entity.type === type);
    }

    // Find the nearest entity of a specific type to a given position
    findNearestEntityOfType(position, type) {
        let nearestEntity = null;
        let minDistance = Infinity;

        this.getEntitiesByType(type).forEach(entity => {
            const distance = Math.sqrt(
                Math.pow(position.x - entity.position.x, 2) +
                Math.pow(position.z - entity.position.z, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestEntity = entity;
            }
        });

        return nearestEntity;
    }
}


*/