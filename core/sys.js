
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
/// @summary pass a tick message to sys resolve at a high frequency suitable for real time human interaction
///

function run() {
	const begin = performance.now()
	this.resolve({tick:true})
	const duration = performance.now() - begin
	const delay = duration < 10 ? (10-duration) : 0
	setTimeout( ()=>{ this.run() } ,delay)
}

///
/// @summary load observer - loads whatever is specified by passing exports into sys.resolve() as message traffic
///

async function load(blob) {
	if(!blob.load) return
	const sys = blob._sys
	for (const file of blob.load) {
		const module = await import("../"+file);
		for (const [key, blob] of Object.entries(module)) {
			if (typeof blob !== 'object') continue
			if(blob.observer) sys.observers.push(blob.observer) // @todo for now stuff them here - later have an observers observer
			blob._metadata = { file, key }
			await sys.resolve(blob)
		}
	}
}

///
/// @summmary public interface for sys - sys provides a messaging backbone to connect together other agents 
///

export const sys = {
	observers: [ load ],
	load : load,
	resolve: resolve,
	run : run
}

