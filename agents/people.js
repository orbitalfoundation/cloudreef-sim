
const waterLevel = globalThis.config.waterLevel;

function people_system(blob,sys) {

	if(!blob.time || typeof blob.time !== 'object') return
	const time = blob.time
	const volume = sys.volume

	const peopleElevation = 2.5;

	const callback = (entity) => {

		/*
		// People less than 10 years old don't move
		if (entity.createdAt + time.secondsPerYear * 10 > time.seconds ) {
			return;
		}

		// Mark people over 30 for deletion
		if (entity.createdAt + time.secondsPerYear * 30 < time.seconds) {
			entity.obliterate = true
			return;
		}
		*/

		// query for spatially nearest match and then move this entity to that location
		const query = {
			position:entity.volume.pose.position,
			order:'distance',
			limit:1,
			callback: (nearest) => {
				// @todo this relies on the binding layer being bound already - it is a bit sketchy
				entity.volume.pose.position.x = nearest.volume.pose.position.x, 
				entity.volume.pose.position.y = nearest.volume.pose.position.y + peopleElevation, 
				entity.volume.pose.position.z = nearest.volume.pose.position.z
			}
		}

		// @todo it is excruciatingly expensive to set this over and over
		// @todo following the boats movement is expensive; should have a parent child relation

		if (time.secondOfDay >= time.eveningSeconds) {
			if(entity._latch == 2) return
			entity._latch = 2
			query.filter = {building:true}
			volume.query(query)
		}

		else if (time.secondOfDay >= time.morningSeconds) {
			if(entity._latch == 1) return
			entity._latch = 1
			query.filter = {boat:true}
			volume.query(query)
		}
	}

	// visit all people every frame

	volume.query({filter:{people:true},callback})
}

const people = {
	people: true,
	volume: { 
		geometry: 'sphere', 
		pose: { scale: {x:2,y:2,z:2 } },
		material: { color: 'gold' } 
	},
}

export const people_spawner = {
	uuid: `/agents/peoples`,
	volume: {
		geometry: 'cube',
		material: { color: 'black' },
		pose: { scale: {x:10,y:10,z:10 } },
	},
	emitter: {
		range: [ waterLevel +1, waterLevel + 3 ],
		quantity: 10,
		spawn: people
	},
	resolve: people_system
}
