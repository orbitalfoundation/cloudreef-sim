
const waterLevel = globalThis.config.waterLevel;

function resolve(blob) {

	if(!blob.time) return
	const time = blob.time
	const sys = blob._sys
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

		// build a query for nearest
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

		// @todo it is brittle to check exact time
		if (time.secondOfDay === time.morningSeconds) {
			query.filter = {boat:true}
			volume.query(query)
		} else if (time.secondOfDay === time.eveningSeconds) {
			query.filter = {building:true}
			volume.query(query)
		}
	}

	// visit all people

	volume.query({filter:{people:true},callback})
}

export const people = {
	uuid: `/agents/people`,
	emitter: {
		minElevation: waterLevel,
		maxElevation: Infinity,
		quantity: 10,
		spawn: {
			people: true,
			volume: { 
				geometry: 'sphere', 
				whd: [3,3,3],
				material: { color: 'gold' } 
			},
		}
	},
	resolve
}
