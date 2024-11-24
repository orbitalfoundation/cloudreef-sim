
import 'https://cdn.jsdelivr.net/npm/orbital-sys@1.0.5/sys.js/+esm'

sys.resolve({
	anchor:import.meta.url,
	load:[
		'./orbital-volume-custom/volume.js',
		'./agents/all.js'
	]
})
