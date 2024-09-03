
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
    './reflect.js',
    './analytics.js',
    './analytics-view.js',
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
    eveningTick: 666,
    daysPassed: 0,
    daysPerYear: 10,
    yearsPassed: 0
};

import { getAnalytics } from './analytics.js';

function advanceSimulation() {
    globalThis.systems.forEach(system => {
        system(state)
    })

    state.tick = (state.tick + 1) % state.ticksPerDay;

    // Increment daysPassed when a full day cycle completes
    if (state.tick === 0) {
        state.daysPassed++;
        console.log(`Day ${state.daysPassed} has passed`);

        // Check if a year has passed
        if (state.daysPassed % state.daysPerYear === 0) {
            state.yearsPassed++;
            console.log(`Year ${state.yearsPassed} has passed`);
        }
    }

    // Log analytics every 100 ticks
    if (state.tick % 100 === 0) {
        const analytics = getAnalytics();
        console.log('Analytics - Entity Totals Over Time:', analytics);
    }
}

setInterval(advanceSimulation, 10); 










