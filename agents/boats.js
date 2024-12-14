
const waterLevel = globalThis.config.waterLevel

function boat_system(blob,sys) {
    if(!blob.time || typeof blob.time !== 'object') return
    const time = blob.time
	const volume = sys.volume

	const callback = (entity) => {

		if(!entity.volume.node) {
			console.log("not ready",entity.uuid)
			return
		}

		const x = entity.volume.pose.position.x
		const y = entity.volume.pose.position.y
		const z = entity.volume.pose.position.z


		// set a home position once
		if (!entity.boat.waypoint) {
			entity.boat.waypoint = { x,y,z }
		}

		// set a fishing location once
		if(!entity.boat.fishingLocation) {
			entity.boat.fishingLocation = { x,y,z }
			volume.query({
				position : {x,y,z},
				minElevation:0,
				maxElevation:waterLevel-1,
				limit:1,
				order:'random',
				callback:(position,index)=>{
					entity.boat.fishingLocation = position
				}
			})
		}

		// move to the starting waypoint in the evening
		// @todo it is expensive to set this over and over
		// @todo interpolate
		if (time.secondOfDay > time.eveningSeconds + 3600) {
			entity.volume.pose.position.x = entity.boat.waypoint.x
			entity.volume.pose.position.y = waterLevel
			entity.volume.pose.position.z = entity.boat.waypoint.z
		}


		// move to fishing location in the morning and not in the evening
		// @todo it is expensive to set this over and over
		// @todo interpolate
		else if (time.secondOfDay > time.morningSeconds - 3600) {
			entity.volume.pose.position.x = entity.boat.fishingLocation.x
			entity.volume.pose.position.y = waterLevel
			entity.volume.pose.position.z = entity.boat.fishingLocation.z
		}

	}

	// visit all boats

	volume.query({filter:{boat:true},callback})
}

const boat = {
	boat: {
		waypoint: null,
		fishingLocation: null,
	},
	volume: { 
		geometry: 'box',
		pose: { position: {x:0,y:0,z:0 }, scale: { x:3, y:5, z:3 }},
		material: { color: 'blue' } 
	},
}

export const boat_spawner = {
	uuid: `/agents/boats`,
	volume: {
		geometry: 'cube',
		pose: { scale: { x:10, y:10, z: 10 }},
		material: { color: 'black' },
	},
	emitter: {
		range: [ waterLevel -2, waterLevel -1 ],
		quantity: 50,
		spawn: boat
	},
	resolve: boat_system
}
