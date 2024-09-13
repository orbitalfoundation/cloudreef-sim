# Overview

A coastal reef ecology simulation - exercising aider/cursor and claude sonnet to write a simulation model from scratch.

This model includes an island fishing village with people, boats, fish and coral. Uses 3js for visualization.

![reef](assets/screenshot.png?raw=true "reef")

## Design

The simulation is implemented in nodejs and leverages the browser for rendering. There's some emphasis on a data driven messaging pattern, there's less emphasis on performance at this stage.

Agents are defined as ordinary json using an ECS like pattern. An entity is decorated with components that describe state such as rendering style, or other capabilities. There are people, boats, fish, trees, buildings. There is an emitter that can spawn collections of other entities. There is also time and day/night cycles.

There is a systems wide message bus (see the sys module) and agent 'manifests' in javascript are inhaled into sys and every export from a manifest is passed as a message to all observers registered with sys. New observers can also be registered. Some important observers are registered early such as in-memory database (db) a renderer (volume).
