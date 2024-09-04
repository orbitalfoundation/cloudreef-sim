# Overview

A reef simulation - exercising aider/cursor and claude sonnet for big block code completion of a simulation model from scratch.

This model is of an island fishing village with people, boats, fish. It is fairly simple. Uses 3js for visualization.

![reef](assets/screenshot.png?raw=true "reef")

## bugs

~ planes geometries were moved to be not at the center but at a corner, and then the entire view was pulled back to center; this could still use some parameterization since it is hardcoded in vis.js

~ sealevel could ideally be at zero - it just would be cleaner if that was the case - however right now the terrain is arranged so that it starts at 0 and extends upwards - so a bit of tidying up is needed

- right now persons and other entities don't have a correct memoization of their starting position; this could use improvement

- lighting?



// @todo i would rather not have types at all
// @todo position should be in volume
// @todo i would rather not have props but have explicit fields
// @todo material may want to indicate flavor such as phong



## architecture / deeper design to revise

- right now entities have a 'type' - instead they really should just have components

- when people are on a boat they could / should move with the boat ? think about how i want to do that

- systems probaby should be objects with an associated observer or behavior rather than naked functions so they can have state

# gameplay

- have people harvest fish from the shore for energy to start with

- have people harvest trees to build boats

- and homes

- corals should grow; and become fish nurseries

- a first person view would be nice

# other debugging and analytics

- debugging displays to show all entities and all systems

- analytics

# lifecycles , timing

	- 24 ticks per day - can run at 10ms per tick - so that is 240 ms, or about 4 ticks per second, or 2.25 seconds per day
	- 10 days per year for now -> so about 20 seconds per year



- fish fission at a rate

- maybe there is a cap? can we visualize the food resources for fish? can those grow back?

- fish die at a rate









