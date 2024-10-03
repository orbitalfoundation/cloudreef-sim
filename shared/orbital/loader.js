
const loaded = {}

async function resolve(blob) {
	if(!blob.load) return
	const sys = blob._sys
	const files = (typeof blob.load === 'string') ? [blob.load] : blob.load
	for (let file of files) {

		// support './' notation for relative asset paths
		if(file[0]=='.' && file[1]=='/' && blob._metadata && blob._metadata.base) {
			const url = new URL(blob._metadata.base + file.substring(1))
			file = url.pathname
		}

		// avoid loading a file twice
		if(loaded[file]) continue
		loaded[file]=file

		// fetch the asset and fully evaluate it
		const module = await import(file);
		for (const [key, blob] of Object.entries(module)) {
			if (typeof blob !== 'object') continue
			const base = window.location.origin + file.substring(0,file.lastIndexOf('/'))
			blob._metadata = { base, file, key }
			await sys.resolve(blob)
		}
	}
}

export const loader = {
	uuid:'/core/loader',
	resolve
}