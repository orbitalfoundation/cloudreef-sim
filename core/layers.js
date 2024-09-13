
class Layers {

	width = 512
	height = 512
	layers = {}

	constructor(width = 512, height = 512) {
		this.width = width
		this.height = height
	}

	// Get a layer by name, create it if it doesn't exist
	get(name) {
		if (!this.layers[name]) {
			this.layers[name] = new Uint8Array(this.width * this.height);
		}
		return this.layers[name];
	}

	// Set the entire layer to a specific value
	set(name, value) {
		const layer = this.get(name);
		for (let i = 0; i < layer.length; i++) {
			layer[i] = value;
		}
	}

	// Set a specific value at a given (x, y) coordinate
	setAt(name, x, y, value) {
		const layer = this.get(name);
		if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
			layer[y * this.width + x] = value;
		} else {
			throw new Error(`Coordinates (${x}, ${y}) are out of bounds`);
		}
	}

	// Get the value at a specific (x, y) coordinate
	getAt(name, x, y) {
		const layer = this.get(name);
		if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
			return layer[y * this.width + x];
		} else {
			throw new Error(`Coordinates (${x}, ${y}) are out of bounds`);
		}
	}

	// Clear a layer (set all values to 0)
	clear(name) {
		this.set(name, 0);
	}

	// Remove a layer entirely
	delete(name) {
		delete this.layers[name];
	}




	/// @summary Returns a collection of positions within a certain elevation range where x,y,z are width, height and depth
	getPositionsWithinElevationRange(minElevation, maxElevation, layername='terrain') {
		const positions = [];
		const layer = this.layers.get(layername);

		if (!layer) {
			console.error(`Layer '${layername}' not found`);
			return positions;
		}

		for (let z = 0; z < this.height; z++) {
			for (let x = 0; x < this.width; x++) {
				const index = x + z * this.width;
				if (index >= layer.length) {
					console.error(`Index out of range: ${index}, layer length: ${layer.length}`);
					continue;
				}
				const y = layer[index];
				if (y > minElevation && y <= maxElevation) {
					positions.push({ x,y,z })
				}
			}
		}

		// console.log(`Found ${positions.length} positions within elevation range ${minElevation}-${maxElevation}`);
		return positions;
	}

	findRandomLocation(currentPosition,minElevation=-Infinity,maxElevation=Infinity,layername='terrain') {
		const maxDistance = 20;
		const positions = this.getPositionsWithinElevationRange(minElevation,maxElevation,layername);
		
		const nearbyPositions = positions.filter(pos => 
			Math.abs(pos.x - currentPosition.x) <= maxDistance &&
			Math.abs(pos.z - currentPosition.z) <= maxDistance
		);

		if (nearbyPositions.length > 0) {
			const randomIndex = Math.floor(Math.random() * nearbyPositions.length);
			return nearbyPositions[randomIndex];
		}

		return null;
	}

}

function resolve(blob) {
	blob._sys.layers = this
	if(!blob.layer) return
	if(blob.layer.data) return
	const width = blob.layer.width
	const height = blob.layer.height
	blob.layer.data = generateIslandElevationWithPerlin(width,height)
}

export const layers = {
	uuid:'/core/layers',
	resolve
}
