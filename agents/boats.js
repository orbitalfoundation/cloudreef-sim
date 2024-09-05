
const config = globalThis.config;

function findRandomWaterLocation(currentPosition) {
	const maxDistance = 20;
	const waterPositions = db.getPositionsWithinElevationRange(-Infinity, config.waterLevel);
	
	const nearbyWaterPositions = waterPositions.filter(pos => 
		Math.abs(pos.x - currentPosition.x) <= maxDistance &&
		Math.abs(pos.z - currentPosition.z) <= maxDistance
	);

	if (nearbyWaterPositions.length > 0) {
		const randomIndex = Math.floor(Math.random() * nearbyWaterPositions.length);
		return nearbyWaterPositions[randomIndex];
	}

	return null;
}

export function observer(blob) {

    if(!blob.tick) return
    const time = blob.time

	Object.values(db.entities).forEach(entity => {
		if (!entity.boat) return
		if (!entity.waypoint) {
			entity.waypoint = { ...entity.position };
		}
		if (time.secondOfDay === time.morningSeconds + 3600) {
			// Move to a random nearby location
			if(!entity.fishingLocation) {
				entity.fishingLocation = findRandomWaterLocation(entity.position);
			}
			if (entity.fishingLocation) {
				entity.position = { ...entity.fishingLocation, y: config.waterLevel };
			}
		} else if (time.secondOfDay === time.eveningSeconds - 3600) {
			// Move back to the starting waypoint
			entity.position = { ...entity.waypoint, y: config.waterLevel };
		}
	})
}

export const boats = {
	uuid: `/agents/boats`,
	emitter: {
		minElevation: 7,
		maxElevation: 9,
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
	observer
}
