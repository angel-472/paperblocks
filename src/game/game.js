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
    await loadTextures(TEXTURES_TO_LOAD, true);
    console.log(`Game: Loaded all assets, starting engine...`);
    await this.#engine._start();

    this.addTestBody();

    for(let i = 0; i < 10; i++){
      this.addABlockOmg(i, 0)
    }

    this.#engine.getCamera().setZoom(4, 58, 0)
  }
  addABlockOmg(gridX, gridY){
    const canvasX = gridX * 16;
    const canvasY = gridY * 16;
    const ecs = this.#engine.getECS();
    const blockEntity = ecs.createEntity();
    ecs.addComponent(blockEntity, 'Transform', {x: canvasX, y: canvasY, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});
    ecs.addComponent(blockEntity, 'Sprite', {width: 16, height: 16, textureId: "grass"});
    ecs.addComponent(blockEntity, 'Collider', {width: 16, height: 16, friction: 0.85});
  }
  addTestBody(){
      const ecs = this.#engine.getECS();
      const blockEntity = ecs.createEntity();
      ecs.addComponent(blockEntity, 'Transform', {x: 16 * 2, y: 16 * -2, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});
      ecs.addComponent(blockEntity, 'Sprite', {width: 16, height: 16, textureId: "no_sprite"});
      const velocity = ecs.addComponent(blockEntity, 'Velocity', {x: 0, y: 0, weight: 1, ignoreGravity: false});
      ecs.addComponent(blockEntity, 'Collider', {width: 16, height: 16, friction: 0.85});

      velocity.y = 10;
  }
}