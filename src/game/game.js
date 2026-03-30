import { engine } from './engine/engine.js';

// Entry point for PaperBlocks game, uses the engine and ECS Scene to manage the game.
export class Game {
  // Private fields
  #engine;

  constructor() {
    this.#engine = engine;
  }
  async _start() {
    await this.#engine._start();

    this.testECS();
  }
  testECS(){
    // Little ECS test
    const ecs = this.#engine.getECS();
    ecs.registerComponentType('Transform', {x: 0, y: 0, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});
    ecs.registerComponentType('Area', {width: 0, height: 0});

    // Create a Player entity
    const playerEntityId = ecs.createEntity();
    ecs.addComponent(playerEntityId, 'Transform', {x: 1, y: 1});
    ecs.addComponent(playerEntityId, 'Transform', {x: 1, y: 1});
  }
}