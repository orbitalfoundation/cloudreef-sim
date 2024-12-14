

export const manifest = {
	anchor: import.meta.url,
	load: [

		// general settings - load this first since it is exposed as a global
		'./config.js',

		// create the heavens and the hearth
		'./scene.js',

		// let there be light
		'./light.js',

		// let there be water underneath the sky and let dry ground appear
		'./ocean.js',
		'./terrain.js',

		// let there be lights in the vault of the sky to separate the day from the night
		'./sun.js',

		// let the land produce vegetation: seed-bearing plants and trees
		'./emitter.js',
		'./trees.js',

		// let the water teem with living creatures
		'./phytoplankton.js',
		'./fish.js',
		'./organism.js',

		// let us make mankind in our image
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
