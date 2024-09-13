
const waterLevel = globalThis.config.waterLevel

export function resolve(blob) {
    if(!blob.time) return
    const time = blob.time
	const sys = blob._sys
	const volume = sys.volume

	const callback = (entity) => {

		// set a home position once
		if (!entity.waypoint) {
			entity.waypoint = { ...entity.position }
		}

		// set a fishing location once
		if(!entity.fishingLocation) {
			volume.query({
				position : entity.position,
				minElevation:0,
				maxElevation:waterLevel-1,
				limit:1,
				order:'random',
				callback:(position,index)=>{
					entity.fishingLocation = position
				}
			})
		}

		// Move to the starting waypoint in the evening
		if (time.secondOfDay > time.eveningSeconds - 3600 && entity.waypoint) {
			entity.position = { ...entity.waypoint, y: waterLevel }
		}

		// move to fishing location in the morning and not in the evening
		else if (time.secondOfDay > time.morningSeconds + 3600 && entity.fishingLocation) {
			entity.position = { ...entity.fishingLocation, y: waterLevel }
		}

	}

	// visit all boats

	volume.query({filter:{boat:true},callback})
}

export const boats = {
	uuid: `/agents/boats`,
	emitter: {
		minElevation: waterLevel - 2,
		maxElevation: waterLevel - 1,
		quantity: 50,
		spawn: {
			boat: true,
			volume: { 
				geometry: 'box', 
				whd: [3, 5, 3], 
				material: { color: 'blue' } 
			},
		}
	},
	resolve
}
