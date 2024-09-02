export const buildingEmitter = {
    uuid: `/emitter/building_emitter`,
    type: 'emitter',
    minElevation: globalThis.config.waterLevel,
    maxElevation: globalThis.config.waterLevel + 5,
    quantity: 50,
    spawn: {
        type: 'building',
        volume: {
            geometry: 'box',
            props: [3, 5, 3],
            material: { color: 0x8B4513 } // SaddleBrown for buildings
        }
    }
};

