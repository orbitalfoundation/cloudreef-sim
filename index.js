
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
//    './hud.js',
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
    seconds: 0,
    hours: 0,
    days: 0,
    years: 0,

    secondOfDay: 0,
    hourOfDay: 0,
    dayOfYear: 0,

    secondsPerDay: 86400,
    secondsStepRate: 86400 / 24,
    daysPerYear: 360,
    daysStepRate: 30,
    morningSeconds: 60 * 60 * 8,
    eveningSeconds: 60 * 60 * 16,
};

import { getAnalytics } from './analytics.js';
import { createHUD, updateHUD } from './hud.js';

const hudElement = createHUD();

function advanceSimulation() {
    globalThis.systems.forEach(system => {
        system(state)
    });

    state.seconds += state.secondsStepRate;
    state.secondOfDay = state.seconds % state.secondsPerDay;
    state.hourOfDay = Math.floor(state.secondOfDay / 3600);
    state.hours = Math.floor(state.seconds / 3600);

    // Increment days when a full day cycle completes
    if (state.secondOfDay < state.secondsStepRate) {
        state.days++;
        state.dayOfYear = (state.dayOfYear + 1) % state.daysPerYear;
        console.log(`Day ${state.days} has passed`);

        // Check if a year has passed
        if (state.dayOfYear === 0) {
            state.years++;
            console.log(`Year ${state.years} has passed`);
        }
    }

    // Update HUD
    updateHUD(hudElement, state);

    // Log analytics every hour
    if (state.secondOfDay % 3600 < state.secondsStepRate) {
        const analytics = getAnalytics();
        console.log('Analytics - Entity Totals Over Time:', analytics);
    }
}

setInterval(advanceSimulation, 1000); // Run every second in real-time










