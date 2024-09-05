
///
/// @summary load manifests - pipes exports to sys.resolve() as messages
///

async function load(files) {
	for (const file of files) {
		const module = await import("../"+file);
		for (const [key, blob] of Object.entries(module)) {
			if (typeof blob !== 'object') continue
			if(blob.observer) this.observers.push(blob.observer) // @todo for now stuff them here - later have an observers observer
			blob._metadata = { file, key }
			await this.resolve(blob)
		}
	}
}

///
/// @summary pass a message to all observers - synchronous for the collection of observers using await on each observer
///

async function resolve(blob) {
	blob._sys = this
	for(const observer of this.observers) {
		if(typeof observer === 'function') {
			await observer(blob)
		}
	}
}

///
/// @summary visit all observers every tick
///

function run() {
	const begin = performance.now()
	this.resolve({tick:true})
	const duration = performance.now() - begin
	const delay = duration < 10 ? (10-duration) : 0
	setTimeout( ()=>{ this.run() } ,delay)
}

///
/// @summmary public interface for sys - sys provides a messaging backbone to connect together other agents 
///

export const sys = {
	observers: [],
	load : load,
	resolve: resolve,
	run : run
}
