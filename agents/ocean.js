
const config = globalThis.config
const db = globalThis.db
const width = globalThis.config.width;
const height = globalThis.config.height;

function createOcean() {
    const oceanEntity = {
        uuid: '/ocean',
        type: 'ocean',
        position: { x: 0, y: config.waterLevel, z: 0 },
        volume: {
            geometry: 'plane',
            props: [width, height],
            material: {
                color: 0x1e90ff, // Ocean color (DeepSkyBlue)
                opacity: 0.5,
                transparent: true,
                side: THREE.DoubleSide
            }
        },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 }
    };

    db.addEntity(oceanEntity);
}

createOcean();
