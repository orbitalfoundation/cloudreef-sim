
///
/// @summary hard-coded list of entities and systems to load
///

const load = [

	'./config.js',
	'./agents/time.js',

	'./core/layers.js',
	'./core/db.js',
	'./core/volume.js',

	'./agents/terrain.js',
	'./agents/ocean.js',

	'./agents/emitter.js',
	'./agents/trees.js',
	'./agents/buildings.js',

	'./agents/sun.js',

	'./agents/people.js',
	'./agents/boats.js',
	'./agents/fish.js',

	'./ux/hud.js',

    './ux/reflect.js',
//    './analytics.js',
//   './analytics-view.js',

]

import { sys } from './core/sys.js'
sys.resolve({load})
sys.run()
