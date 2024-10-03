
export const resolvers = {
	resolve:(blob)=>{
		if(!blob.resolve) return
		const sys = blob._sys
		if(sys.resolvers.includes(blob)) return // @todo this may be lazy - use uuid and fn check also
		sys.resolvers.push(blob)
	}
}