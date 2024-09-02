
const files = [
    './core/config.js',
    './core/layers.js',
    './core/db.js',
    './core/vis.js',
    './agents/terrain.js',
    './agents/ocean.js',
    './agents/trees.js',
    './agents/buildings.js',
    './agents/people.js',
    './agents/boats.js',
    './agents/lights.js',
    './agents/emitter.js',
    './agents/fish.js',
];

globalThis.systems = []

for (const file of files) {
    const module = await import(file);
    for (const [key, value] of Object.entries(module)) {
        if (typeof value === 'object' && value !== null && 'uuid' in value) {
            globalThis.db.addEntity(value);
        } else if (typeof value === 'function') {
            globalThis.systems.push(value);
        }
    }
}

const state = {
    tick: 0,
    ticksPerDay: 1000,
    morningTick: 333,
    eveningTick: 666
};

function advanceSimulation() {

    globalThis.systems.forEach(system=>{
    	system(state)
    })

    state.tick = (state.tick + 1) % state.ticksPerDay;
}

setInterval(advanceSimulation, 10); 










