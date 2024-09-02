
// scene
const scene = globalThis.scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(100, 100, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0));

// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth damping (inertia)
controls.dampingFactor = 0.05; // Damping factor for the inertia
controls.screenSpacePanning = false; // Whether to pan the camera horizontally in screen space
controls.minDistance = 10; // Set the minimum zoom distance
controls.maxDistance = 500; // Set the maximum zoom distance
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical angle of the camera
controls.update();

// update
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();



