
function resolve(blob) {

	// filter for new emitter events - @todo smarter resolve filtering
	if(blob.tick) return
	if(!blob.emitter) return
	if(blob.emitter.latched) return
	const emitter = blob.emitter
	emitter.latch = true;

	// create a new entity on demand at position
	const callback = (position,index) => {
		// @todo volume property is being conserved - must not do so
		const volume = { ...emitter.spawn.volume }
		const spawn = { ...emitter.spawn }
		spawn.volume = volume
		sys.resolve({
			...spawn,
			position: position,
			uuid: `${blob.uuid}/${index}`
		})
	}

	// directly query volume (which is exposed on sys) for spatial positions to create entities
	sys.volume.query({
		minElevation:emitter.minElevation,
		maxElevation:emitter.maxElevation,
		limit:emitter.quantity,
		order:'random',
		callback,
	})

}

export const emitter = {
	uuid:'/agents/emitter',
	resolve
}


