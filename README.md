# Overview

A reef simulation - exercising aider/cursor and claude sonnet for big block code completion of a simulation model from scratch.

This model is of an island fishing village with people, boats, fish. It is fairly simple. Uses 3js for visualization.

![reef](reef.png?raw=true "reef")

## TODOS

 - one quirk is that the map is from 0,0,width,height but the geometry is centered at the origin... might be nice to consolidate

 - also i have set sealevel at 10 due to quirks in perlin noise generation

 - also lighting seems borked now?

 ## behavior


right now i place boats and fish right away ....
i think a better way is that there is some kind of emitter rules that creates a new entity
typically say this could be created where a person is, or where a parent fish is

so when the simulation starts we might start with only people
and then they have to chop lumber to accumulate enough lumber to build boats and or buildings
i could have preferred locations where those kinds of construction projects should take place
although there is some argument for starting a simulation with some boats and so on


but i do think i would prefer a static declaration of an emitter
rather than having code which produces things in the inclusions




 boats should move to a random position at sea nearby

