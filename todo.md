
## core framework todos

	~ sealevel could ideally be at zero - it just would be cleaner if that was the case - however right now the terrain is arranged so that it starts at 0 and extends upwards - so a bit of tidying up is needed

	- globals -> get rid of them
		- config
		- db
		- layers
		- time

	- vis/volume
		- vis material indicate flavor such as phong
		- move position to be inside volume
		- allow lights to have richer geometry
		- do not use props from making geometries

	- view
		- first person
		- adjust scales of entities to be human scale

	- misc
		- improve analytics
		- auto comment
		- auto docs
		- regression tests unit tests
		- move to typescript with rollup or esbuild

	- db
		- layers is separate from db
		- spatial indexing
		- query offset, limit
		- closures/cursors rather than returning lists
		- finish up obliterate

## agent features to improve

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

	- boats
		- people should move with boats
		- harvest actual fish

	- fish
		- flock
		- have a plankton layer or bloom layer
		- change elevation
		- die / reproduce

	- corals
		- grow
		-

