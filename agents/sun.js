
const config = globalThis.config
const size = config.size
const sundist = size + 20
const moondist = size
const slightlydifferentspeed = 1.1

function resolve(blob) {
	if(!blob.time) return
	const time = blob.time
	if(typeof time !== 'object') return // hack @todo separate tick from time better

	const sun = (entity)=>{
		const radius = sundist
		const angle = time.seconds / time.secondsPerDay * Math.PI * 2 - Math.PI / 2
		entity.volume.pose.position.set(
			Math.cos(angle) * radius / 2 + radius / 2,
			Math.sin(angle) * radius / 2,
			radius / 2
		)
		// hack - not registering parent/child relationships
		// this is a bug in orbital-volume three-helper line 137 due to multi instancing
		if(entity.volume.node && sunlightGeometry.volume.node &&
			sunlightGeometry.volume.node.parent != entity.volume.node) {
			entity.volume.node.add(sunlightGeometry.volume.node);
		}
	}

	const moon = (entity)=>{
		const radius = moondist
		const sunAngle = time.seconds / time.secondsPerDay * Math.PI * 2 - Math.PI / 2
		const moonAngle = sunAngle * slightlydifferentspeed + Math.PI/8 
		entity.volume.pose.position.set(
			Math.cos(moonAngle) * radius / 2 + radius / 2,
			Math.sin(moonAngle) * radius / 2,
			radius / 2
		)
		entity.volume.pose.rotation.y = moonAngle

		// hack - not registering parent/child relationships 
		// this is a bug in orbital-volume three-helper line 137 due to multi instancing
		if(entity.volume.node && moonLightGeometry.volume.node &&
			moonLightGeometry.volume.node.parent != entity.volume.node) {
			entity.volume.node.add(moonLightGeometry.volume.node);
		}

	}

	// @todo it is a bit of a hack to do both here
	// @todo is a global resolve/tick the best way to handle real time updates?
	sun(sunLight)
	moon(moonLight)

}

const sunLight = {
	uuid: '/light/sun',
	sun: true,
	volume: {
		geometry: 'light',
		light:'directionalLight',
		color: 0xffffff,
		intensity: 1,
		distance: sundist,
		decay: 1,
		pose: {
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 }
		},
	},
	resolve
}

const sunlightGeometry = {
	uuid: '/light/sun/geometry',
	parent: sunLight,
	volume: {
		geometry:'sphere',
		pose: { scale:{x:10,y:10,z:10}},
		material: {
			kind: 'basic',
			color: 0xffffcc,
		}
	},
}

const moonLight = {
	uuid: '/light/moon',
	moon: true,
	volume: {
		geometry: 'light',
		light:'pointLight',
		color: 0xaaaaff,
		intensity: 0.3,
		distance: 600,
		decay: 2,
		pose: {
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 }
		},
	},
}

const moonLightGeometry = {
	uuid: '/light/moon/geometry',
	parent: moonLight,
	volume: {
		geometry:'sphere',
		pose: { scale:{x:10,y:10,z:10}},
		material: {
			color: 0xffffff ,
			textureURL: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg",
			displacementURL: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg",
			displacementScale: 0.06,
			bumpScale: 0.04,
		}
	},
}

// backdrop sphere
// 			worldURL: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg",


export const ordered_list = [ sunLight, sunlightGeometry, moonLight, moonLightGeometry ]
