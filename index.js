

//////////////////////////////////////////////////////////////////////////////////////
// setup core

import { Layers } from './core/layers.js'
import { DB } from './core/db.js'

// config

const config = globalThis.config = {
    width: 512,
    height: 512,
    waterLevel: 10,
    terrain: 'terrain',
}

// build databases

const layers = globalThis.layers = new Layers(config.width,config.height);
const db = globalThis.db = new DB(layers,config);
globalThis.systems = []

//////////////////////////////////////////////////////////////////////////////////////
// agents

await import('./agents/terrain.js');
await import('./agents/ocean.js');
await import('./agents/trees.js');
await import('./agents/buildings.js');
await import('./agents/people.js');
await import('./agents/boats.js');
await import('./agents/lights.js');
await import('./agents/emitter.js');

//await import('./agents/fish.js')

//////////////////////////////////////////////////////////////////////////////////////
// support for visualization

import './core/vis.js'
const scene = globalThis.scene;

function visualizeEntities(interpolationRate = 0.1) {
    Object.values(db.entities).forEach(entity => {
        if (!entity.node && entity.volume) {
            // Create a new node for the entity
            let geometry, material;
            switch (entity.volume.geometry) {

                case 'light':
                case 'ambientLight':
                case 'directionalLight':

console.log("adding light",entity)

                     switch (entity.volume.geometry) {                                                                                                                                                       
                         case 'directionalLight':                                                                                                                                                           
                             entity.node = new THREE.DirectionalLight(entity.volume.color, entity.volume.intensity);                                                                                                 
                             break;                                                                                                                                                                    
                         case 'ambientLight':                                                                                                                                                               
                             entity.node = new THREE.AmbientLight(entity.volume.color, entity.volume.intensity);                                                                                                     
                             break;                                                                                                                                                                    
                         default:                                                                                                                                                                      
                             delete entity.volume
                             console.warn(`Unsupported light type: ${entity.volume.lightType}`);                                                                                                              
                             return;                                                                                                                                                                   
                     }                                                                                                                                                                                 
                     break

                case 'box':
                    geometry = new THREE.BoxGeometry(...entity.volume.props);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(entity.volume.props[0], 32, 32);
                    break;
                case 'cylinder':
                    geometry = new THREE.CylinderGeometry(...entity.volume.props);
                    break;
                case 'plane':
                    geometry = new THREE.PlaneGeometry(...entity.volume.props);
                    break;
                case 'terrain':
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
                    break
                default:
                    console.warn(`Unsupported geometry type: ${entity.volume.geometry}`);
                    delete entity.volume
                    return;
            }
            material = new THREE.MeshBasicMaterial(entity.volume.material);
            entity.node = new THREE.Mesh(geometry, material);
            entity.node.position.set(entity.position.x, entity.position.y, entity.position.z);
            if (entity.rotation) {
                entity.node.rotation.set(entity.rotation.x, entity.rotation.y, entity.rotation.z);
            }
            scene.add(entity.node);
        }

        if (entity.node && entity.position) {
            // Interpolate X, Y, and Z positions
            entity.node.position.x += (entity.position.x - entity.node.position.x) * interpolationRate;
            entity.node.position.y += (entity.position.y - entity.node.position.y) * interpolationRate;
            entity.node.position.z += (entity.position.z - entity.node.position.z) * interpolationRate;
        }


    });
}

////////////////////////////////////////////////////////////////////////////////////
// support for advancing sim

const state = {
    tick: 0,
    ticksPerDay: 1000,
    morningTick: 333,
    eveningTick: 666
};

function advanceSimulation() {

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










