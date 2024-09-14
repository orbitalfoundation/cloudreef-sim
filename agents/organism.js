
const xsize = globalThis.config.size
const zsize = globalThis.config.size

const organismPrototoype = {
	age: 0,
	mass: 0.1,
	energy: 0.5,
	speed: 0.5,
	heading: 0.0,
	gestation: 0.0,
	womb: true,
	range: [0, 999],
	maxSpeed: 1,
	maxHeadingChange: Math.PI / 4,
	gestationRate: 0.05,
	childrenCount: 0,
	gestationThreshold: 0.8,
	searchRadius: 10,
	consumes: 'phytoplankton',
}

function organismUpdate(sys,entity,volume,terrain) {

	const organism = entity.organism

	// promote if not fully fleshed out yet
	if(!organism.hasOwnProperty('energy')) {
		Object.entries(organismPrototoype).forEach( ([k,v]) => {
			if(!organism.hasOwnProperty(k)) organism[k]=v
		})
	}

	// Set heading if not set
	if (!organism.heading) {
		organism.heading = Math.random() * 2 * Math.PI
	}

	// Update energy use - @todo this should be configurable
	organism.energy -= 0.001

	// Dead?
	if (organism.energy <= 0) {
		entity.obliterate = true
		return
	}

	// Update age
	// @todo do something with this
	organism.age += 0.01

	// Update gestation if any
	if (organism.gestation > 0) {
		organism.gestation += organism.gestationRate
		if (organism.gestation >= 1) {

			// there is an energetic cost to reproduction
			const parent = entity
			parent.organism.gestation = 0
			parent.organism.energy *= 0.5
			parent.organism.childrenCount++

			// clone parent
			const childOrganism = JSON.parse(JSON.stringify(parent.organism))
			childOrganism.age = 0
			childOrganism.energy = 0.5
			childOrganism.gestation = 0
			childOrganism.heading = Math.random() * 2 * Math.PI

			const childEntity = {
				...JSON.parse(JSON.stringify(parent.organism.spawnHints)),
				organism: childOrganism,
				position: {...parent.position},
				uuid: `${parent.uuid}/offspring/${Date.now()}`
			}

			sys.resolve(childEntity)
		}
	}

	// movement
	const maxHeadingChange = organism.maxHeadingChange
	const speed = organism.speed
	const minY = organism.range[0]
	const maxY = organism.range[1]
	for (let attempts = 0; attempts < 10; attempts++) {
		let newX = entity.position.x + Math.cos(organism.heading) * speed
		let newY = maxY
		let newZ = entity.position.z + Math.sin(organism.heading) * speed
		newX = Math.max(0, Math.min(newX, xsize - 1))
		newZ = Math.max(0, Math.min(newZ, zsize - 1))
		const terrainHeight = terrain[Math.floor(newZ) * zsize + Math.floor(newX)]
		if (terrainHeight >= minY && terrainHeight <= maxY) {
			entity.position = { x: newX, y: newY, z: newZ }
			break
		} else {
			organism.heading += (Math.random() - 0.5) * maxHeadingChange
		}
	}

	// Reason only occasionally
	if(Math.random() > 0.3 ) {
		return
	}

	// Randomly adjust heading
	organism.heading += (Math.random() - 0.5) * maxHeadingChange

	// Hunger may adjust heading
	// @todo energy consumption for cognition could be budgeted here and perhaps conserved
	if (organism.energy <= organism.gestationThreshold) {
		let nearbyFood = null
		const filter = {}
		filter[organism.consumes||'phytoplankton'] = true
		volume.query({
			filter,
			position: entity.position,		
			radius: organism.searchRadius || 10,
			callback: (food) => {
				nearbyFood = food
			}
		})
		if (nearbyFood && !nearbyFood.obliterate) {
			const dx = nearbyFood.position.x - entity.position.x
			const dy = 0 //nearbyFood.position.y - entity.position.y
			const dz = nearbyFood.position.z - entity.position.z
			const dist2 = dx*dx+dy*dy+dz*dz
			entity.organism.heading = Math.atan2(dz, dx)

			if(dist2 < 10) {
				nearbyFood.obliterate = true
				organism.energy += 0.1 // @todo make into a variable
			}
		}
	}

	// May reproduce
	else if (organism.energy > organism.gestationThreshold && organism.womb && organism.gestation === 0) {
		if(Math.random() < 0.1) {
			organism.gestation = 0.01 // @todo variablize
		}
	}

}

function organismSystem(blob) {
	if (!blob.time) return
	const sys = blob._sys
	const volume = sys.volume
	const terrain = volume.terrain()
	volume.query({
		filter:{organism:true},
		callback:(entity)=>{
			organismUpdate(sys,entity,volume,terrain)
		}
	})
}

export const organisms = {
	resolve: organismSystem
}

