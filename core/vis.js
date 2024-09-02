const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 0.5).normalize();
scene.add(directionalLight);

camera.position.z = 100;
camera.position.y = 50;
camera.lookAt(new THREE.Vector3(0, 0, 0));


// Create OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Optional: Customize the controls
controls.enableDamping = true; // Enable smooth damping (inertia)
controls.dampingFactor = 0.05; // Damping factor for the inertia
controls.screenSpacePanning = false; // Whether to pan the camera horizontally in screen space
controls.minDistance = 10; // Set the minimum zoom distance
controls.maxDistance = 500; // Set the maximum zoom distance
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical angle of the camera

// Position the camera
camera.position.set(100, 100, 100);
controls.update();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the controls in the animation loop
    controls.update();

    renderer.render(scene, camera);
}
animate();

globalThis.scene = scene


