import { Application, Assets, Container, Sprite } from 'pixi.js';

// Renderer engine component, responsible for rendering and updating the game graphics using PixiJS
class Renderer {
  #container;
  #app;

  constructor() {

  }
  async _start() {
    console.log('🎨 Starting Diaza game renderer...');
    const app = new Application();

    // Initialize the PIXI JS application
    await app.init({ background: '#1099bb', resizeTo: window });
    document.body.appendChild(app.canvas);
    this.#app = app;

    // Create and add a container to the stage
    const container = new Container();
    app.stage.addChild(container);
    this.#container = container;

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // Create a 5x5 grid of bunnies in the container
    for (let i = 0; i < 25; i++) {
      const bunny = new Sprite(texture);

      bunny.x = (i % 5) * 40;
      bunny.y = Math.floor(i / 5) * 40;
      container.addChild(bunny);
    }

    this._update(0); // Initial update to set positions
  }
  // Update logic for the renderer, called every frame with deltaTime for frame-independent updates
  _update(deltaTime) {
    let container = this.#container;
    let app = this.#app;
    
    // Move the container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center the bunny sprites in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    
    // Continuously rotate the container!
    // * use delta to create frame-independent transform *
    container.rotation -= 0.02 * deltaTime;
  }
}

export const renderer = new Renderer();