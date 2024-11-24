
#  Todo - Nov 2024

1) Volumetric queries.

What we are seeing is a need for a much richer spatial / volumetric query support. I did ask Claude to write a spatial indexing function using a sparse voxel octree ( see https://gist.github.com/anselm/b372ef016517424eec20ea0ba196d5ab ) which could be used. But generally speaking there's a class of spatial queries and spatial indexing that needs to be performant.

At the moment a simpler 2d version of these queries are stuffed into the Volume service. This is kind of a hack, and it needs work, and is currently computationally expensive.

2) Time

At the moment I am ignoring the orbital-sys provided tick method - I should merge the ideas there with the local 'time' service.

3) Volume itself

Note that this instance of orbital-volume should be merged with the npm orbital-volume. There are several small defects here, such as entity.position should become entity.volume.position . Also respecting the concept of 'obliterate'. As well all scales should be in real world units. A first person mode would be nice as well.

4) Analytics

It looks like the value of simulations like this depends on a much richer analytics interface - see jupyter notebooks. There may also be real value in runtime views enumerating all objects.

5) Persistent WASM blobs / Server Side

At the moment this runs in the browser - for larger scale durable sims it may make sense to have a headless mode on a server.

6) Improved richness of model

A richer simulation would include corals, turbidity, temperature, nutrients, sterility and many other factors. Also fish would better respect time and have day/night awareness. It may be necessary to simulate at a fixed rate even if only rendering infrequently; decoupling rendering from simulation. Fish should school and have more intelligent object avoidance. There should be reproductive strategies that involve coral reef nurseries, based on real data.

Human participants generally need a much richer model (for any sim project not just this one). This may be a separate effort. This includes concepts like a lifespan, an energy budget, a cognitive budget, eating, dying, children, childhoods, resource scavenging, building, consensus mechanisms and many other factors.
