import { engine } from '../engine/engine.js';
import { loadTextures } from './utils/assetsManager.js';

import { TEXTURES_TO_LOAD } from './constants/textures.js';

// Entry point for PaperBlocks game, uses the engine and ECS Scene to manage the game.
export class Game {
  // Private fields
  #engine;

  constructor() {
    this.#engine = engine;
  }
  async _start() {
    await loadTextures(TEXTURES_TO_LOAD);
    console.log(`Game: Loaded all assets, starting engine...`);
    await this.#engine._start();
  }
}