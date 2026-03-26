import { engine } from './engine/engine.js';


export class Game {
  // Private fields
  #engine;

  constructor() {
    this.#engine = engine;
  }
  async _start() {
    await this.#engine._start();
  }
}