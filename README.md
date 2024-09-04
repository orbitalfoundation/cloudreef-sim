# Overview

A reef simulation - exercising aider/cursor and claude sonnet for big block code completion of a simulation model from scratch.

This model is of an island fishing village with people, boats, fish. It is fairly simple. Uses 3js for visualization.

![reef](assets/screenshot.png?raw=true "reef")

## bugs

	~ sealevel could ideally be at zero - it just would be cleaner if that was the case - however right now the terrain is arranged so that it starts at 0 and extends upwards - so a bit of tidying up is needed

	- ecs improvements
		- don't have entity types just components
		- move position to be inside volume
		- allow lights to have richer geometry
		- do not use props from making geometries
		- material indicate flavor such as phong

	- view
		- first person
		- adjust scales of entities to be human scale
		- improve analytics
		- auto comment
		- auto docs
		- regression tests unit tests
		- move to typescript with rollup or esbuild

## revise play

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

