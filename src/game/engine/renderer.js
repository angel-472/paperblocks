import { Application, Assets, Container, Sprite } from 'pixi.js';

// Renderer engine component, responsible for rendering and updating the game graphics using PixiJS
class Renderer {
  #container;
  #app;

  constructor() {

  }
  async _start() {
    console.log('Renderer: Starting PIXIJS renderer system...');
    const app = new Application();

    // Initialize the PIXI JS application
    await app.init({ background: 'lightgray', resizeTo: window });
    document.body.appendChild(app.canvas);
    this.#app = app;

    // Create and add a container to the stage
    const container = new Container();
    app.stage.addChild(container);
    this.#container = container;

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // // Create a 5x5 grid of bunnies in the container
    // for (let i = 0; i < 25; i++) {
    //   const bunny = new Sprite(texture);

    //   bunny.x = (i % 5) * 40;
    //   bunny.y = Math.floor(i / 5) * 40;
    //   container.addChild(bunny);
    // }

    this._update(0); // Initial update to set positions
  }
  // Update logic for the renderer, called every frame with deltaTime for frame-independent updates
  _update(deltaTime) {

  }
}

export const renderer = new Renderer();