
import { loader } from './loader.js'
import { resolvers } from './resolvers.js'

async function resolve(blob) {
	blob._sys = this
	for(const resolver of this.resolvers) {
		if(resolver.resolve) {
			await resolver.resolve(blob,this)
		}
	}
}

export const sys = globalThis.sys = {
	resolvers: [ loader, resolvers ],
	resolve
}

