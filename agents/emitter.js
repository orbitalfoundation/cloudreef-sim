
function resolve(blob) {

	// filter for new emitter events - @todo smarter resolve filtering

	if(blob.tick) return
	if(!blob.emitter) return
	if(blob.emitter.latched) return
	const emitter = blob.emitter
	emitter.latch = true;

	// create a new entity on demand at position
	// note currently sys does _not_ make sure objects are unique @todo improve

	const callback = (position,index) => {
		var duplicated = JSON.parse(JSON.stringify(emitter.spawn))
		sys.resolve({
			...duplicated,
			position: position,
			uuid: `${blob.uuid}/${index}`
		})
	}

	// directly query volume (which is exposed on sys) for spatial positions to create entities

	sys.volume.query({
		minElevation:emitter.range[0] || 0,
		maxElevation:emitter.range[1] || Infinity,
		limit:emitter.quantity || 100,
		order:'random',
		callback,
	})

}

export const emitter = {
	uuid:'/agents/emitter',
	resolve
}


