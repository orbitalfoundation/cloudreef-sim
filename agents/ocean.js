const scene = globalThis.scene
const width = globalThis.config.width;
const height = globalThis.config.height;

function createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(width, height, 1, 1);

    // Create a material with transparency
    const oceanMaterial = new THREE.MeshBasicMaterial({
        color: 0x1e90ff, // Ocean color (DeepSkyBlue)
        opacity: 0.5,    // Set transparency (0.0 to 1.0)
        transparent: true,
        side: THREE.DoubleSide // Make the plane visible from both sides
    });

    // Create the ocean mesh
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);

    // Position the ocean at height 0
    ocean.position.y = 0;

    // Rotate the plane to be horizontal
    ocean.rotation.x = -Math.PI / 2;

    // Add the ocean to the scene
    scene.add(ocean);
}

createOcean();
