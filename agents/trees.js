
export const trees = {
    uuid: `/agents/tree`,
    emitter: {
        minElevation: 11,
        maxElevation: Infinity,
        quantity: 200,
        spawn: {
            tree: true,
            volume: { 
                geometry: 'cylinder', 
                props: [0.5, 2, 5, 8], 
                material: { color: 0x228B22 } 
            },
        }
    }
}
