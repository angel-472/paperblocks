import { ECS } from './ecs/ecs.js';
import { registerDefaultComponents } from "./defaultComponents.js";

import { renderSystem } from './systems/rendering/renderSystem.js';
import { physicsSystem } from './systems/physics/physicsSystem.js';

// Main engine component, responsible for mananing the high level game loop, delegates to scene tree for rendering and updates
class Engine {
  #renderSystem;
  #ecs;
  #physicsSystem;

  constructor(){
    this.#renderSystem = renderSystem;
    this.#ecs = new ECS();
    this.#physicsSystem = physicsSystem;
  }
  async _start(options = {}) {
    console.log('Engine: Starting game engine...');
    console.log(`Engine: Registering default ECS components for Engine...`);
    registerDefaultComponents(this.#ecs);
    await this.#renderSystem._start();
    await this.#physicsSystem._start();

    this.#startGameLoop();
  }
  // Update lifecycle method, called every millisecond (uncapped) by the game loop, provides deltaTime for frame-independent updates
  _update(deltaTime){
    this.#physicsSystem._update(deltaTime); //first, so that physics updates before rendering

    this.#renderSystem._update(deltaTime); //last
  }
  #startGameLoop(){
    let lastFrameTime = performance.now();
    setInterval(() => {
      const deltaTime = (performance.now() - lastFrameTime) / 16.67; // Normalize to 60fps (16.67ms per frame)
      this._update(deltaTime);
      lastFrameTime = performance.now();
    }, 0); // Run an update loop (uncapped, provides deltaTime)
  }
  getECS(){
    return this.#ecs;
  }
  getCamera(){
    return this.#renderSystem.camera;
  }
}

export const engine = new Engine();

if(import.meta.env.DEV && window !== undefined) {
  window._engine = engine; // Expose for debugging in dev mode
}