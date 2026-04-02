import { engine } from '../engine/engine.js';
import { load}

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
}