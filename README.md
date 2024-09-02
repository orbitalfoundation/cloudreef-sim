# Overview

A reef simulation - exercising aider/cursor and claude sonnet for big block code completion of a simulation model from scratch.

This model is of an island fishing village with people, boats, fish. It is fairly simple. Uses 3js for visualization.

![reef](reef.png?raw=true "reef")

## TODOS

 - one quirk is that the map is from 0,0,width,height but the geometry is centered at the origin... might be nice to consolidate

 - also i have set sealevel at 10 due to quirks in perlin noise generation ... it is slightly inelegant

 - person home position is kinda hacked - may want to look at

 - also lighting seems borked now?

- right now when boats move the people do not move

- right now boats and fish are placed immediately; we many want to grow them

- we may want people to harvest trees to do this

- people may need to shore fish to have energy also

