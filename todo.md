
## core framework todos

	- perhaps rename volume to 'spatial' ?

	- sys resolve() will store raw objects and to volume and it exposes a risk
	  on the one hand it is convenient to be able to directly edit artifacts as declared in a manifest
	  but on the other hand there's a risk of shared state where it isn't wanted; such as in emitter
	  need to think about what the formal policy should be here; could it be an option?

	- richer query support formalization
	  there's a fundamental need for richer spatial queries and hashing; such as sparse voxel hashes
	  but exposing volume directly kind of defeats the separation of concerns...
	  also the ecs queries for components arguably could be clarified such as sys.ecs not sys.db?

	- volume to improve
		- note that the entity.position concept is incorrect - it should be entity.volume.position
		- obliterate needs to be completed
		- allow lights to have richer geometry
		- first person
		- adjust scales of entities to be human scale

	- miscellaneous
		- improve the admin and analytics interface
		- do a jupyter notebooks style analytics display
		- generate comments
		- perhaps it is possible to expose a richer documentation concept in general?
		- regression tests unit tests
		- move to typescript with rollup or esbuild

## agent features to improve

	- run persistently in clould
		allow revising agents without stopping server
		wasm blobs

	- corals

	- fish
		- use the day night schedule timers
		- obstacle avoidance is required
		- currently do not change elevations
		- reproduce near corals only; coral nurseries

	- people
		- right now persons and other entities don't have a correct memoization of their starting position; this could use improvement
		- people have a lifespan
		- people have energy budget
		- people harvest fish for energy
		- people die
		- people give birth
		- people have childhoods
		- people harvest trees to build boats
		- people harvest trees to build shelter
		- people have some kind of affinity to a home and or work
		- people should move with boats
		- harvest actual fish via people


