
const config = globalThis.config
const db = globalThis.db

function start3js() {

	// scene
	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// camera
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(0,config.height,config.height)
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
	const animate = () => {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}
	animate();

	// adjust entire scene to center on the terrain @todo generalize
	const root = new THREE.Group()
	scene.add(root)
	root.position.x = - config.width / 2
	root.position.z = - config.height / 2
	globalThis.scene = root
}

start3js()

function observer(blob) {

	if(!blob.tick) return

	const interpolationRate = 0.1

	Object.values(db.entities).forEach(entity => {

		// obliterate
		if(entity.obliterate) {
			if(entity.node) {
				scene.remove(entity.node)
				entity.node = null
			}
			return
		}

		// create node if needed
		if (!entity.node && entity.volume) {

			let geometry, material;

			if(entity.volume.material) {
				material = new THREE.MeshPhongMaterial(entity.volume.material);
			} else {
				material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
			}

			switch (entity.volume.geometry) {

				case 'pointLight':
					entity.node = new THREE.PointLight(entity.volume.color, entity.volume.intensity, entity.volume.distance, entity.volume.decay)
					entity.node.add( new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material ) )
					break
				case 'ambientLight':
					entity.node = new THREE.AmbientLight(entity.volume.color, entity.volume.intensity)
					entity.node.add( new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material ) )
					break
				case 'directionalLight':
					entity.node = new THREE.DirectionalLight(entity.volume.color, entity.volume.intensity)
					entity.node.add( new THREE.Mesh(new THREE.CylinderGeometry(0.5, 10, 10, 8), material ) )
					break
				case 'box':
					geometry = new THREE.BoxGeometry(...entity.volume.props);
					entity.node = new THREE.Mesh(geometry, material);
					break;
				case 'sphere':
					geometry = new THREE.SphereGeometry(entity.volume.props[0], 32, 32);
					entity.node = new THREE.Mesh(geometry, material);
					break;
				case 'cylinder':
					geometry = new THREE.CylinderGeometry(...entity.volume.props);
					entity.node = new THREE.Mesh(geometry, material);
					break;
				case 'plane':
					// @note planes must cover the number space of the extent of the playing area - so are not centered
					geometry = new THREE.PlaneGeometry(...entity.volume.props);
					entity.node = new THREE.Mesh(geometry, material);
					entity.node.rotation.set(Math.PI/2,0,0)
					entity.position.x += entity.volume.props[0] / 2 
					entity.position.z += entity.volume.props[1] / 2 
					break;
				case 'terrain':
					// @note planes must cover the number space of the extent of the playing area - so are not centered
					geometry = new THREE.PlaneGeometry(...entity.volume.props);
					{
						const layer = layers.get('terrain')
						const vertices = geometry.attributes.position.array;
						for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
							vertices[i + 2] = layer[j];
						}
						geometry.computeVertexNormals();
						geometry.attributes.position.needsUpdate = true;
					}
					entity.node = new THREE.Group()
					const child = new THREE.Mesh(geometry, material) 
					child.rotation.set(-Math.PI/2,0,0)
					child.position.x += entity.volume.props[0] / 2 
					child.position.z += entity.volume.props[1] / 2 
					entity.node.add(child)
					break
				default:
					console.warn(`Unsupported geometry type: ${entity.volume.geometry}`);
					delete entity.volume
					return;
			}
			if(entity.node && entity.position) {
				entity.node.position.x = entity.position.x
				entity.node.position.y = entity.position.y
				entity.node.position.z = entity.position.z
			}
			if(entity.node && entity.rotation) {
				entity.node.rotation.x = entity.rotation.x
				entity.node.rotation.y = entity.rotation.y
				entity.node.rotation.z = entity.rotation.z
			}
			scene.add(entity.node)
		}

		// Interpolate X, Y, and Z positions
		if (entity.node && entity.position) {
			entity.node.position.x += (entity.position.x - entity.node.position.x) * interpolationRate;
			entity.node.position.y += (entity.position.y - entity.node.position.y) * interpolationRate;
			entity.node.position.z += (entity.position.z - entity.node.position.z) * interpolationRate;
		}

		if (false && entity.node && entity.rotation) {
			entity.node.rotation.x += (entity.rotation.x - entity.node.rotation.x) * interpolationRate;
			entity.node.rotation.y += (entity.rotation.y - entity.node.rotation.y) * interpolationRate;
			entity.node.rotation.z += (entity.rotation.z - entity.node.rotation.z) * interpolationRate;
			console.log(entity.node.rotation)
		}

	});
}

export const volume = {
	uuid: '/core/volume',
	observer : observer
}



