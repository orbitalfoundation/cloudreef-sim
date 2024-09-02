
export const treeEmitter = {
    uuid: `/emitter/tree_emitter`,
    type: 'emitter',
    minElevation: 11,
    maxElevation: 999,
    quantity: 100,
    spawn: {
        type: 'tree',
        volume: { 
            geometry: 'cylinder', 
            props: [0.5, 2, 5, 8], 
            material: { color: 0x228B22 } 
        }
    }
};

