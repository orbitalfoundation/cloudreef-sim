import { PerlinNoise } from '../core/perlin.js';

const db = globalThis.db;
const layers = globalThis.layers;
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain');

function generateIslandElevationWithPerlin(seed = 42) {
    const noise = new PerlinNoise(seed);
    const noiseScale = 0.01; // Adjust for island size
    const elevationScale = 50; // Adjust for elevation height
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance;

            const nx = x * noiseScale;
            const ny = y * noiseScale;
            const noiseValue = noise.noise(nx, ny);

            // Apply a radial gradient to create an island shape
            const radialGradient = Math.max(0, 1 - distance);
            const elevation = (noiseValue * 0.5 + 0.5) * radialGradient * elevationScale;

            layer[x + y * width] = elevation;
        }
    }
}

function createTerrainEntity() {
    const terrainEntity = {
        uuid: '/terrain',
        type: 'terrain',
        position: { x: 0, y: 0, z: 0 },
        volume: {
            geometry: 'terrain',
            props: [width, height, width - 1, height - 1],
            material: { color: 0xd3b683, wireframe: false },
            layer: 'terrain'
        }
    };
    db.addEntity(terrainEntity);
}

generateIslandElevationWithPerlin();
createTerrainEntity();

