
const loaded = {}

async function resolve(blob) {
	if(!blob.load) return
	const sys = blob._sys
	const files = (typeof blob.load === 'string') ? [blob.load] : blob.load
	for (const file of files) {
		// avoid loading a file twice
		if(loaded[file]) continue
		loaded[file]=file
		const module = await import("../"+file);
		for (const [key, blob] of Object.entries(module)) {
			if (typeof blob !== 'object') continue
			blob._metadata = { file, key }
			await sys.resolve(blob)
		}
	}
}

export const loader = {
	uuid:'/core/loader',
	resolve
}