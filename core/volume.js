
let scene = null
let renderer = null
let camera = null
let controls = null
let layer = null
let layerSize = 0
let entities = {}

function add_scene(props) {

	if(scene || renderer) return

	const aperture = props.aperture || 75
	const near = props.near || 0.1
	const far = props.far || 1000
	const width = window.innerWidth
	const height = window.innerHeight
	const cameraPosition = props.cameraPosition || [0,0,0]
	const cameraTarget = props.cameraTarget || [0,0,0]
	const cameraMin = props.cameraMin || 1
	const cameraMax = props.cameraMax || 1000

	scene = new THREE.Scene()
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(width,height)
	document.body.appendChild(renderer.domElement)

	camera = new THREE.PerspectiveCamera(aperture, width / height, near, far)
	camera.position.set(...cameraPosition)
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(...cameraTarget)
	controls.enableDamping = true
	controls.dampingFactor = 0.05
	controls.screenSpacePanning = false
	controls.minDistance = cameraMin
	controls.maxDistance = cameraMax
	//controls.maxPolarAngle = Math.PI / 2
	controls.update();

	if(false) {
		scene.add( new THREE.GridHelper( 16, 16 ) )
		scene.add( new THREE.AxesHelper( 8 ) )
	}

	const animate = () => {
		requestAnimationFrame(animate)
		controls.update()
		renderer.render(scene, camera)
	}
	animate()

}


import { PerlinNoise } from '../libs/perlin.js'

function generateIslandElevationWithPerlin(size,seed=42) {
	const data = new Uint8Array(size*size)
	const noise = new PerlinNoise(seed)
	const noiseScale = 0.01; // Adjust for island size
	const elevationScale = 50; // Adjust for elevation height
	const centerX = size / 2
	const centerY = size / 2
	const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const dx = x - centerX
			const dy = y - centerY
			const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance
			const noiseValue = noise.noise(dx * noiseScale, dy * noiseScale)
			// Apply a radial gradient to create an island shape
			const radialGradient = Math.max(0, 1 - distance)
			const elevation = (noiseValue * 0.5 + 0.5) * radialGradient * elevationScale
			data[x + y * size] = elevation
		}
	}
	return data
}


function update(entity) {

	// ignore entities that have no volume
	if(!entity.volume) {
		return
	}

	// for now let's hold onto the entities to allow for spatial queries locally
	// spatial queries fit into a role this module has - it's debatable precisely how to do them @todo improve
	if(entity.uuid) {
		entities[entity.uuid] = entity
	}

	// @todo later allow changing node type
	// @todo node should be on volume not on entity
	if(entity.volume.node) return

	// nodes may have a material
	let material;
	if(entity.volume.material) {
		switch(entity.volume.material.kind) {
			case 'basic':
				const props = { ... entity.volume.material }
				delete props.kind
				material = new THREE.MeshBasicMaterial(props)
				break
			default:
				material = new THREE.MeshPhongMaterial(entity.volume.material)
				break
		}
	} else {
		material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
	}

	let geometry
	switch (entity.volume.geometry) {

		case 'scene':
			// @todo allow multiple scenes and also pass props
			add_scene(entity.volume)
			return
			break

		case 'pointLight':
			entity.volume.node = new THREE.PointLight(entity.volume.color, entity.volume.intensity, entity.volume.distance, entity.volume.decay)
			entity.volume.node.add( new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material ) )
			break

		case 'ambientLight':
			entity.volume.node = new THREE.AmbientLight(entity.volume.color, entity.volume.intensity)
			entity.volume.node.add( new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material ) )
			break

		case 'directionalLight':
			entity.volume.node = new THREE.DirectionalLight(entity.volume.color, entity.volume.intensity)
			entity.volume.node.add( new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material ) )
			break

		case 'spotLight':
			entity.volume.node = new THREE.SpotLight(entity.volume.color, entity.volume.intensity)
			entity.volume.node.add( new THREE.Mesh(new THREE.CylinderGeometry(0.5, 10, 10, 8), material ) )
			break

		case 'cube':
		case 'box':
			geometry = new THREE.BoxGeometry(1,1,1);
			entity.volume.node = new THREE.Mesh(geometry, material);
			break;

		case 'sphere':
			geometry = new THREE.SphereGeometry(1, 32, 32);
			entity.volume.node = new THREE.Mesh(geometry, material);
			break;

		case 'cylinder':
			geometry = new THREE.CylinderGeometry(...entity.volume.props);
			entity.volume.node = new THREE.Mesh(geometry, material);
			break;

		case 'plane':

			geometry = new THREE.PlaneGeometry(...entity.volume.props);
			entity.volume.node = new THREE.Mesh(geometry, material);
			// adjust plane to represent the extent rather than using default centering, also rotate them flat
			entity.volume.node.rotation.set(Math.PI/2,0,0)
			entity.position.x += entity.volume.props[0] / 2 
			entity.position.z += entity.volume.props[1] / 2 
			break;

		case 'layer':

			// build art
			geometry = new THREE.PlaneGeometry(...entity.volume.props);
			{
				const width = entity.volume.props[0]
				const height = entity.volume.props[1]
				const elevations = entity.volume.elevations = generateIslandElevationWithPerlin(width,height)
				const vertices = geometry.attributes.position.array;
				for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
					vertices[i + 2] = elevations[j]
				}
				geometry.computeVertexNormals();
				geometry.attributes.position.needsUpdate = true;

				// @todo store better
				layer = elevations
				layerSize = width
			}

			// adjust plane to represent the extent rather than using default centering, also rotate them flat
			entity.volume.node = new THREE.Group()
			const child = new THREE.Mesh(geometry, material) 
			child.rotation.set(-Math.PI/2,0,0)
			child.position.x += entity.volume.props[0] / 2 
			child.position.z += entity.volume.props[1] / 2 
			entity.volume.node.add(child)
			break

		default:
			console.warn(`Unsupported geometry type: ${entity.volume.geometry}`);
			delete entity.volume
			return;
	}
	if(entity.volume.node && entity.volume.whd) {
		entity.volume.node.scale.x = entity.volume.whd[0]
		entity.volume.node.scale.y = entity.volume.whd[1]
		entity.volume.node.scale.z = entity.volume.whd[2]
	}
	if(entity.volume.node && entity.position) {
		entity.volume.node.position.x = entity.position.x
		entity.volume.node.position.y = entity.position.y
		entity.volume.node.position.z = entity.position.z
	}
	if(entity.volume.node && entity.rotation) {
		entity.volume.node.rotation.x = entity.rotation.x
		entity.volume.node.rotation.y = entity.rotation.y
		entity.volume.node.rotation.z = entity.rotation.z
	}

	if(!scene) {
		console.error("volume: no scene")
		return
	}

	scene.add(entity.volume.node)

}

function resolve(blob) {

	const sys = blob._sys

	// stuff volume into sys for now - still debating the right way to expose this for queries if at all
	sys.volume = this

	// was passed a volume - do work on it
	if(blob.volume) {
		update(blob)
	}

	// was passed time - update time
	if(!blob.time) return

	const interpolationRate = 0.1

	// deletions
	Object.values(entities).forEach(entity => {
		if(entity.obliterate) {
			if(entity.volume && entity.volume.node) {
				scene.remove(entity.volume.node)
				entity.volume.node = null
			}
			delete entities[entity.uuid]
		}
	})

	// updates - interpolation helper
	Object.values(entities).forEach(entity => {

		if (entity.volume.node && entity.position) {
			entity.volume.node.position.x += (entity.position.x - entity.volume.node.position.x) * interpolationRate;
			entity.volume.node.position.y += (entity.position.y - entity.volume.node.position.y) * interpolationRate;
			entity.volume.node.position.z += (entity.position.z - entity.volume.node.position.z) * interpolationRate;
		}

		if (false && entity.volume.node && entity.rotation) {
			entity.volume.node.rotation.x += (entity.rotation.x - entity.volume.node.rotation.x) * interpolationRate;
			entity.volume.node.rotation.y += (entity.rotation.y - entity.volume.node.rotation.y) * interpolationRate;
			entity.volume.node.rotation.z += (entity.rotation.z - entity.volume.node.rotation.z) * interpolationRate;
		}

	});

}

///
/// spatial query support
/// supports both querying bitmap layers and also 3d objects
/// currently unoptimized
/// later will use sparse voxel mesh
///

function query(props) {

	const callback = props.callback

	//
	// layer queries (into bitmaps) are performed separately / disjointly with any other query
	//

	if(props.hasOwnProperty('minElevation')) {

		const minElevation = props.minElevation || 0
		const maxElevation = props.maxElevation || Infinity
		const order = props.order
		const limit = props.limit

		const size = layerSize
		const data = layer

		let positions = [];

		for (let z = 0; z < size; z++) {
			for (let x = 0; x < size; x++) {
				const index = x + z * size;
				if (index >= data.length) {
					console.error(`Index out of range: ${index}, layer length: ${data.length}`);
					continue;
				}
				const y = data[index];
				if (y >= minElevation && y <= maxElevation) {
					positions.push({ x,y,z })
				}
			}
		}

		// always randomly sort the collection
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

		const shuffle = (array) => {
			let currentIndex = array.length
			while (currentIndex != 0) {
				let randomIndex = Math.floor(Math.random() * currentIndex)
				currentIndex--
				[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
			}
		}
		shuffle(positions)

		// also filter by a position?
		if(props.position) {
			const maxDistance = 20
			positions = positions.filter(xyz => 
				Math.abs(xyz.x - props.position.x) <= maxDistance &&
				Math.abs(xyz.z - props.position.z) <= maxDistance
			)
		}

		// nothing?
		if(!positions.length) return

		// return the desired number of candidates
		for(let i = 0; i < limit; i++) {
			const randomIndex = Math.floor(Math.random() * positions.length);
			const position = positions[randomIndex];
			if(callback) callback(position,i)
		}

		// do not fall thru - but do return the positions also
		return positions
	}

	//
	// for non layer searches optionally pre-filter candidates
	// @todo note it is expensive to do this; hashing of components would help
	// @todo note this also duplicates some of the query capabilities of other components
	//

	const query_matches = (args,candidate) => {
		for (const [key,val] of Object.entries(args)) {
			if(!candidate.hasOwnProperty(key)) return false
			if(candidate[key] instanceof Object) continue
			if(candidate[key]!==val) return false
		}
		return true
	}

	let candidates = []

	if(props.filter) {
		Object.values(entities).forEach(entity => {
			if(query_matches(props.filter,entity)) {
				candidates.push(entity)
			}
		})
	} else {
		candidates = Object.values(entities)
	}

	// return nothing if no candidates

	if(!candidates.length) {
		return []
	}

	//
	// return all candidates if no other filters
	//

	if(!props.position) {
		candidates.forEach(entity=>{
			if(callback)callback(entity)
		})
	}

	//
	// else return nearest match only
	// @todo note a real spatial hash would be less costly
	//

	else {

		const position = props.position
		let minDistance = props.radius || Infinity
		let nearestEntity = null

		candidates.forEach(entity => {
			const distance = Math.sqrt(
				Math.pow(position.x - entity.position.x, 2) +
				Math.pow(position.y - entity.position.y, 2) +
				Math.pow(position.z - entity.position.z, 2)
			)
			if (distance < minDistance) {
				minDistance = distance
				nearestEntity = entity
			}
		})

		if(nearestEntity) {
			if(callback)callback(nearestEntity)
		}
	}

	// also return the candidates as a convenience
	return candidates
}

export const volume = {
	uuid: '/core/volume',
	resolve,
	query,
	terrain: () => { return layer } // @todo hack
}


