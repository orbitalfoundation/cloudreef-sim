
function start3js() {

    // scene
    const scene = new THREE.Scene();
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
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // adjust entire scene to center on the terrain
    const root = new THREE.Group()
    scene.add(root)
    root.position.x = -256
    root.position.z = -256
    globalThis.scene = root
}

start3js()

export function visualizeEntities(state) {
    const interpolationRate = 0.1
    const db = globalThis.db
    Object.values(db.entities).forEach(entity => {
        if (!entity.node && entity.volume) {

            // Create a new node for the entity
            let geometry, material;

            if(entity.volume.material) {
                material = new THREE.MeshBasicMaterial(entity.volume.material);
            }

            switch (entity.volume.geometry) {

                case 'light':
                case 'ambientLight':
                case 'directionalLight':

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
                    geometry = new THREE.PlaneGeometry(...entity.volume.props);
                    entity.node = new THREE.Mesh(geometry, material);
                    entity.node.rotation.set(Math.PI/2,0,0)
                    entity.position.x += entity.volume.props[0] / 2 
                    entity.position.z += entity.volume.props[1] / 2 
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

            if(entity.node) {
                if(entity.position) {
                    entity.node.position.set(entity.position.x, entity.position.y, entity.position.z);
                }
                if (entity.rotation) {
//                    entity.node.rotation.set(entity.rotation.x, entity.rotation.y, entity.rotation.z);
                }
                scene.add(entity.node);
            }

        }

        // Interpolate X, Y, and Z positions
        if (entity.node && entity.position) {
            entity.node.position.x += (entity.position.x - entity.node.position.x) * interpolationRate;
            entity.node.position.y += (entity.position.y - entity.node.position.y) * interpolationRate;
            entity.node.position.z += (entity.position.z - entity.node.position.z) * interpolationRate;
        }


    });
}




/*


the problem is that things are centered; so the terrain is at the origin

i feel like the terrain should be at width/2 , height / 2 

and then all of the scene elements would now be exactly centered i think 

if i had a parent node that was displaced by -width/2

and added everything to that

i would be ok

...

or ... 



*/










