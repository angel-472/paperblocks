import { renderer } from './renderer.js';
import { ECS } from './ecs/ecs.js';
import { registerDefaultComponents } from "./defaultComponents.js";

// Main engine component, responsible for mananing the high level game loop, delegates to scene tree for rendering and updates
class Engine {
  #renderer;
  #ecs;

  constructor(){
    this.#renderer = renderer;
    this.#ecs = new ECS();
  }
  async _start(){
    console.log('Engine: Starting game engine...');
    console.log(`Engine: Registering default ECS components for Engine...`);
    registerDefaultComponents(this.#ecs);
    await this.#renderer._start();

    this.#startGameLoop();
  }
  // Update lifecycle method, called every millisecond (uncapped) by the game loop, provides deltaTime for frame-independent updates
  _update(deltaTime){
    this.#renderer._update(deltaTime);
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
}

export const engine = new Engine();