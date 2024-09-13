
const config = globalThis.config
const size = globalThis.config.size
const waterLevel = globalThis.config.waterLevel

export const oceanEntity = {
    uuid: '/ocean',
    ocean: true,
    position: { x: 0, y: waterLevel, z: 0 },
    volume: {
        geometry: 'plane',
        props: [size, size],
        material: {
            color: 0x1e90ff, // Ocean color (DeepSkyBlue)
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        }
    }
}