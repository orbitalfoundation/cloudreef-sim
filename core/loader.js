///
/// @summary load observer - loads whatever is specified by passing exports into sys.resolve() as message traffic
///

async function resolve(blob) {
	if(!blob.load) return
	const sys = blob._sys
	const files = (typeof blob.load === 'string') ? [blob.load] : blob.load
	for (const file of files) {
		const module = await import("../"+file);
		for (const [key, blob] of Object.entries(module)) {
			if (typeof blob !== 'object') continue
			blob._metadata = { file, key }
			if(blob.initialize && typeof blob.initialize === 'function') blob.initialize({_sys:sys}) // for now @todo improve
			await sys.resolve(blob)
		}
	}
}

export const loader = {
	uuid:'/core/loader',
	resolve
}