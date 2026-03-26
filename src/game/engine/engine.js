import { renderer } from './renderer.js';

// Main engine component, responsible for mananing the high level game loop, delegates to scene tree for rendering and updates
class Engine {
  // Private fields
  #renderer;
  #nodeTree;

  constructor(){
    this.#renderer = renderer;
    this.#nodeTree = []; // An array of Node objects representing the logical scene graph (both rendering and non-rendering nodes)
  }
  async _start(){
    console.log('Engine: ⚙️ Starting Diaza game engine...');
    await this.#renderer._start();

    this.#startGameLoop(); // Start the game lifecycle loop
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
}

export const engine = new Engine();