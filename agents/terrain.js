

const layers = globalThis.layers
const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;
const layer = layers.get('terrain')

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Plane geometry for the terrain - add before work

const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
const material = new THREE.MeshLambertMaterial({ color: 0xd3b683, wireframe: false });
const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;

const adjust = new THREE.Group()
adjust.add(terrain)
adjust.position.y -= 10
scene.add(adjust)

globalThis.terrain = adjust


//////////////////////////////////////////////////////////////////////
// raw perlin

class PerlinNoise {
    constructor(seed=1234) {
        this.p = this.generatePermutation(seed);
    }

    generatePermutation(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        let n, swap;
        for (let i = 255; i > 0; i--) {
            n = Math.floor((seed % 1) * (i + 1));
            seed = seed * 16807 % 2147483647;
            swap = p[i];
            p[i] = p[n];
            p[n] = swap;
        }

        return p.concat(p); // Duplicate the array
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const aa = this.p[this.p[X] + Y];
        const ab = this.p[this.p[X] + Y + 1];
        const ba = this.p[this.p[X + 1] + Y];
        const bb = this.p[this.p[X + 1] + Y + 1];

        return this.lerp(v, this.lerp(u, this.grad(this.p[aa], x, y), this.grad(this.p[ba], x - 1, y)),
            this.lerp(u, this.grad(this.p[ab], x, y - 1), this.grad(this.p[bb], x - 1, y - 1)));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateIslandElevationWithPerlin(seed = 42) {
    const noise = new PerlinNoise(seed);
    const elevationLayer = 'elevation';
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

            layer[x+y*width] = elevation
        }
    }
}

generateIslandElevationWithPerlin()

// lower below water
//for(let i = 0; i < width*height;i++) layer[i] = layer[i] - 10

// Modify the plane's vertices based on elevation data
const vertices = geometry.attributes.position.array;
for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
	vertices[i + 2] = layer[j]
}

geometry.computeVertexNormals();
geometry.attributes.position.needsUpdate = true;







