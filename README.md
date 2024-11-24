# Cloudreef-Sim - Nov 2024

This demo exercises a few distinct ideas:

- How well can tools like Claude/Aider reason about source code, specifically for agent based sims?
- Can these tools be used for building simulations more easily and accessibly?
- Can we build any kind of visually appealing, reasonably fast toy simulation?

In this demo we stage a conceptual island reef ecology, with land and water. There are 'homes' with people, boats, fish. In the morning the fisher-folk go the boats and fish, and in the evening they return home. Fish reproduce at a rate, and require food.

See a demo at https://orbitalfoundation.github.io/cloudreef-sim/

![reef](assets/screenshot.png?raw=true "reef")

## Running

Run tiny-server (or any http server) in the root folder and visit with a browser.

## Technical design

A pub/sub message broker (see https://github.com/orbitalfoundation/orbital-sys ) is used to decouple code fragments. 'Agents' are defined as 'ECS' entities decorated with components and with a 'time' function triggering system updates. Also a concept of 'manifests' is used to load the initial system state and behavior.

The orbital-volume service reacts to state changes and paints those changes to the display; decoupling state from rendering. It also (at the moment) has a database that can be queried. This needs to be revisted as a concept.
