
// @todo could use meta information to find local path as a load hint

export const manifest = {

	load: [

		// general settings - load this first since it is exposed as a global
		'./agents/config.js',

		// setup scene and camera for display
		'./agents/scene.js',

		// let there be land, part the seas and first light
		'./agents/terrain.js',
		'./agents/ocean.js',
		'./agents/sun.js',

		// sprinkle ecosystem with participants
		'./agents/emitter.js',
		'./agents/phytoplankton.js',
		'./agents/fish.js',
		'./agents/organism.js',

//		'./agents/trees.js',
//		'./agents/buildings.js',
//		'./agents/boats.js',
//		'./agents/people.js',

		// introduce an idea of time
		'./agents/time.js',

		// introduce a heads up display showing stats
		'./agents/hud.js',

		// other analytics; jupyter notebook kinds of graphs over time
	//    './ux/reflect.js',
	//    './analytics.js',
	//   './analytics-view.js',

	]
}
