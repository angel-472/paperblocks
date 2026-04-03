import { engine } from '../engine/engine.js';
import { loadTextures } from '../engine/utils/assetsManager.js';

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

    this.addABlockOmg(30, 300);
    this.addABlockOmg(46, 300);
    this.addABlockOmg(70, 300);
  }
  addABlockOmg(canvasX, canvasY){
    const ecs = this.#engine.getECS();
    const blockEntity = ecs.createEntity();
    ecs.addComponent(blockEntity, 'Transform', {x: canvasX, y: canvasY, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});
    ecs.addComponent(blockEntity, 'Area', {width: 16, height: 16});
    ecs.addComponent(blockEntity, 'Sprite', {width: 16, height: 16, textureId: "grass"});
  }
}