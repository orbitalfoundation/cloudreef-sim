
function observer(blob) {

	// filter for new emitter events
	if(blob.tick) return
	if(!blob.emitter) return
	if(blob.emitter.latched) return
	const emitter = blob.emitter
	emitter.latch = true;

	const db = globalThis.db;
	if(!db) return

	// @todo use a db cursor - get candidate places for entities
	let positions = db.getPositionsWithinElevationRange(emitter.minElevation, emitter.maxElevation);
	if (positions.length < 1) return;

	// spawn the desired quantity of entities from the supplied template at a random location
	// @todo prevent duplicate placement by deleting used positions

	for (let i = 0; i < emitter.quantity; i++) {
		const randomIndex = Math.floor(Math.random() * positions.length);
		const position = positions[randomIndex];
		const spawn = {
			...emitter.spawn,
			position: position,
			uuid: `${blob.uuid}/${i}`
		}
		db.addEntity(spawn)
	}
}

export const emitter = {
	uuid:'/agents/emitter',
	observer
}


