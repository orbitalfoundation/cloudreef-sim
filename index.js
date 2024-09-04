
///
/// @summary hard-coded list of entities and systems to load
///

const scenario_files = [

	'./config.js',

	'./core/time.js',
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

	'./ux/hud.js',

//    './reflect.js',
//    './analytics.js',
//   './analytics-view.js',

];

import { systems_load, systems_run } from './core/systems.js'

systems_load(scenario_files)

systems_run()
