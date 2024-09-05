
const layers = globalThis.layers
const config = globalThis.config
const time = globalThis.time

class DB {
    constructor(layers, config) {
        this.entities = {}; // Object to store entities by UUID
        this.layers = layers;
        this.config = config;
    }

    /// @summary Add or update an entity to the database
    addEntity(entity) {
        if (!entity.uuid) {
            throw new Error("Entity must have a uuid");
        }
        let prev = this.entities[entity.uuid]
        if(!prev) {
            prev = { createdAt: globalThis.time.seconds }
        }
        prev = { createdAt: globalThis.time.seconds }
        this.entities[entity.uuid] = {
            ...prev,
            ...entity,
            updatedAt: globalThis.time.seconds
        }
    }

    /// @summary Get an entity by UUID
    getEntity(uuid) {
        return this.entities[uuid] || null;
    }

    /// @summary Remove an entity by UUID
    removeEntity(uuid) {
        delete this.entities[uuid];
    }

    /// @summary Clear all entities
    clearEntities() {
        this.entities = {};
    }

    /// @summary Returns a collection of positions within a certain elevation range where x,y,z are width, height and depth
    getPositionsWithinElevationRange(minElevation, maxElevation, layername='terrain') {
        const positions = [];
        const layer = this.layers.get(layername);

        if (!layer) {
            console.error(`Layer '${layername}' not found`);
            return positions;
        }

        for (let z = 0; z < this.config.height; z++) {
            for (let x = 0; x < this.config.width; x++) {
                const index = x + z * this.config.width;
                if (index >= layer.length) {
                    console.error(`Index out of range: ${index}, layer length: ${layer.length}`);
                    continue;
                }
                const y = layer[index];
                if (y > minElevation && y <= maxElevation) {
                    positions.push({ x,y,z })
                }
            }
        }

        // console.log(`Found ${positions.length} positions within elevation range ${minElevation}-${maxElevation}`);
        return positions;
    }

    /// @summary Get shoreline positions - @todo use values relative to config.waterLevel instead of hardcoded values
    getShorelinePositions(minElevation = 7, maxElevation = 9) {
        return this.getPositionsWithinElevationRange(minElevation, maxElevation);
    }

    /// @summary Get land positions above a certain threshold - @todo use config.waterLevel instead of hardcoded value 10
    getLandPositions(threshold = 10) {
        return this.getPositionsWithinElevationRange(threshold, Infinity);
    }

    /// @summary Get entities with component
    getEntitiesWithComponent(name) {
        return Object.values(this.entities).filter(entity => entity[name] ? true : false );
    }

    /// @summary Find the nearest entity with a given component to a given position
    findNearestEntityWithComponent(position, name) {
        let nearestEntity = null;
        let minDistance = Infinity;

        this.getEntitiesWithComponent(name).forEach(entity => {
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

globalThis.db = new DB(globalThis.layers,globalThis.config);

export const db_observer = {
    uuid: '/core/db',
    observer: (blob) => {
        if(blob.tick) return
        if(!blob.uuid) {
            console.log("db blob no id",blob)
            return
        }
        db.addEntity(blob)
    }
}





