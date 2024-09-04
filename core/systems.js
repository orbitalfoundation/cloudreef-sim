
///
/// @summary a collection of systems to run every tick
///

const config = globalThis.config
const systems = globalThis.systems = []

///
/// @summary import the scenario definition which consists of entities (state) and systems (behaviors to run)
///

export async function systems_load(files) {
	for (const file of files) {
		const module = await import("../"+file);
		for (const [key, value] of Object.entries(module)) {
			if (typeof value === 'object' && value !== null && 'uuid' in value) {
				if(!globalThis.db) {
					console.error("core: db does not exist yet")
					continue
				}
				globalThis.db.addEntity(value);
			} else if (typeof value === 'function') {
				systems.push(value);
			}
		}
	}
}

///
/// @summary run all the systems forever, with a short delay between iterations
///

export function systems_run() {
	const begin = performance.now()
	systems.forEach(system => {
		system()
	})
	const duration = performance.now() - begin
	const delay = config ? ( duration < config.delay ? ( config.delay-duration) : 0 ) : 10
	setTimeout(systems_run,delay)
}

