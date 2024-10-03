
// @todo could use meta information to find local path as a load hint

export const manifest = {

	load: [

		// general settings - load this first since it is exposed as a global
		'./config.js',

		// setup scene and camera for display
		'./scene.js',

		// let there be land, part the seas and first light
		'./terrain.js',
		'./ocean.js',
		'./sun.js',

		// sprinkle ecosystem with participants
		'./emitter.js',
		'./phytoplankton.js',
		'./fish.js',
		'./organism.js',

		'./trees.js',
		'./buildings.js',
		'./boats.js',
		'./people.js',

		// introduce an idea of time
		'./time.js',

		// introduce a heads up display showing stats
		'./hud.js',

		// other analytics; jupyter notebook kinds of graphs over time
	//    './ux/reflect.js',
	//    './analytics.js',
	//   './analytics-view.js',

	]
}
