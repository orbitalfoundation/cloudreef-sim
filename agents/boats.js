
const waterLevel = globalThis.config.waterLevel

export function boat_system(blob) {
    if(!blob.time) return
    const time = blob.time
	const sys = blob._sys
	const volume = sys.volume

	const callback = (entity) => {

		// set a home position once
		if (!entity.boat.waypoint) {
			entity.boat.waypoint = { ...entity.position }
		}

		// set a fishing location once
		if(!entity.boat.fishingLocation) {
			volume.query({
				position : entity.position,
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
		if (time.secondOfDay > time.eveningSeconds - 3600 && entity.boat.waypoint) {
			entity.position = { ...entity.boat.waypoint, y: waterLevel }
		}

		// move to fishing location in the morning and not in the evening
		// @todo it is expensive to set this over and over
		else if (time.secondOfDay > time.morningSeconds + 3600 && entity.boat.fishingLocation) {
			entity.position = { ...entity.boat.fishingLocation, y: waterLevel }
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
		whd: [3, 5, 3], 
		material: { color: 'blue' } 
	},
}

export const boat_spawner = {
	uuid: `/agents/boats`,
	emitter: {
		range: [ waterLevel -2, waterLevel -1 ],
		quantity: 50,
		spawn: boat
	},
	resolve: boat_system
}
