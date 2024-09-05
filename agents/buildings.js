export const buildings = {
    uuid: `/emitter/buildings`,
    emitter: {
        minElevation: globalThis.config.waterLevel,
        maxElevation: globalThis.config.waterLevel + 5,
        quantity: 50,
        spawn: {
            building: true,
            volume: {
                geometry: 'box',
                whd: [3, 5, 3],
                material: { color: 0x8B4513 }
            }
        }
    }
}

