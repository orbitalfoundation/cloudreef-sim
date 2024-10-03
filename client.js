
import './shared/orbital/sys.js'
sys.resolve({
	anchor:import.meta.url,
	load:[
		'./shared/orbital-volume/volume.js',
		'./agents/all.js'
	]
})
