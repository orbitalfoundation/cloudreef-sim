export class Layers {
    constructor(width = 4096, height = 4096) {
        this.width = width;
        this.height = height;
        this.layers = {}; // Object to store the layers by name
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
}

