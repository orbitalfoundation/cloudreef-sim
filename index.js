

import './core/vis.js'

import { Layers } from './core/layers.js'
import { DB } from './core/db.js'

const config = globalThis.config = {
	width:512,
	height:512,
}

const layers = globalThis.layers = new Layers(config.width,config.height);
const db = globalThis.db = new DB(layers,config);

globalThis.systems = []

await import('./agents/terrain.js')

await import('./agents/trees.js')

await import('./agents/buildings.js')

await import('./agents/people.js')

await import('./agents/boats.js')

//await import('./agents/fish.js')

const terrain = globalThis.terrain



///////////////////

const state = {
	tick:0,
	ticksPerDay: 1000,
	morningTick: 333,
	eveningTick: 666
}


function visualizeEntities(interpolationRate = 0.1) {
    Object.values(db.entities).forEach(entity => {
        if (entity.node) {
            // Interpolate X, Y, and Z positions
            entity.node.position.x += (entity.position.x - entity.node.position.x) * interpolationRate;
            entity.node.position.y += (entity.position.y - entity.node.position.y) * interpolationRate;
            entity.node.position.z += (entity.position.z - entity.node.position.z) * interpolationRate;
        } else if (entity.volume) {
            // Create a new node for the entity
            let geometry, material;
            switch (entity.volume.geometry) {
                case 'box':
                    geometry = new THREE.BoxGeometry(...entity.volume.props);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(entity.volume.props[0], 32, 32);
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(...entity.volume.props);
                    break;
                default:
                    console.warn(`Unsupported geometry type: ${entity.volume.geometry}`);
                    return;
            }
            material = new THREE.MeshBasicMaterial(entity.volume.material);
            entity.node = new THREE.Mesh(geometry, material);
            entity.node.position.set(entity.position.x, entity.position.y, entity.position.z);
            terrain.add(entity.node);
        }
    });
}

function advanceSimulation() {

	console.log("on tick",state.tick)

	// update systems
    globalThis.systems.forEach(system=>{
    	system(state)
    })

    // Update visual representation of entities
    visualizeEntities()

    // Increment the global tick
    state.tick = (state.tick + 1) % state.ticksPerDay;


    // Optionally, re-render the scene here if needed
    //renderer.render(scene, camera);
}

// Example: Run the simulation in a loop - advance 10 times per second
setInterval(advanceSimulation, 10); 










