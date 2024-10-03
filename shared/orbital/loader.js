
const loaded = {}

async function resolve(blob) {
	if(!blob.load) return
	const sys = blob._sys
	const files = (typeof blob.load === 'string') ? [blob.load] : blob.load
	for (let file of files) {

		// support './' notation for relative asset paths
		if(file[0]=='.' && file[1]=='/') {
			if(blob._metadata && blob._metadata.file) {
				const base = blob._metadata.file.substring(0,blob._metadata.file.lastIndexOf('/'))
				file = base + file.substring(1)
			} else if(blob.anchor) {
				// given than an anchor is a filename find the base path segment safely
				const base = blob.anchor.substring(0,blob.anchor.lastIndexOf('/'))
				file = base + file.substring(1)
			} else {
				console.error('sys loader unanchored path speculation not fully supported yet')
			}
		} else if(file[0]=='/') {

		} else {
			// @todo add import map support later
			// there's a design defect in browser importmaps that they cannot be modified after module imports
			// console.warn('sys loader may not support unanchored paths',file[0])
		}

		// avoid loading a file twice
		if(loaded[file]) continue
		loaded[file]=file

		// fetch the asset and fully evaluate it
		const module = await import(file);
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