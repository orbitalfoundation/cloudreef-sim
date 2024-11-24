
const waterLevel = globalThis.config.waterLevel;

function people_system(blob,sys) {

	if(!blob.time) return
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
			position:entity.position,
			order:'distance',
			limit:1,
			callback: (nearest) => {
				entity.position = {
					x: nearest.position.x, 
					y: nearest.position.y + peopleElevation, 
					z: nearest.position.z
				}
			}
		}

		// @todo it is expensive to set this over and over
		// @todo following the boats movement is expensive; should have a parent child relation

		if (time.secondOfDay >= time.eveningSeconds) {
			query.filter = {building:true}
			volume.query(query)
		}

		else if (time.secondOfDay >= time.morningSeconds) {
			query.filter = {boat:true}
			volume.query(query)
		}
	}

	// visit all people

	volume.query({filter:{people:true},callback})
}

const people = {
	people: true,
	volume: { 
		geometry: 'sphere', 
		whd: [2,2,2],
		material: { color: 'gold' } 
	},
}

export const people_spawner = {
	uuid: `/agents/peoples`,
	volume: {
		geometry: 'cube',
		material: { color: 'black' },
		whd: [10,10,10]
	},
	emitter: {
		range: [ waterLevel +1, waterLevel + 3 ],
		quantity: 10,
		spawn: people
	},
	resolve: people_system
}
