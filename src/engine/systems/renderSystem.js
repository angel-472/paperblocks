import { Application, Assets, Container, Sprite } from 'pixi.js';
import { getTexture } from '../utils/assetsManager';
import { engine } from '../engine.js';

// Renderer engine component, responsible for rendering and updating the game graphics using PixiJS
class RenderSystem {
  #container;
  #app;
  #camera;

  async _start() {
    console.log('RenderSystem: Starting render system using PixiJS...');
    const app = new Application();

    // Initialize the PIXI JS application
    await app.init({ background: 'lightgray', resizeTo: window });
    document.body.appendChild(app.canvas);
    this.#app = app;

    // Create and add a container to the stage
    const container = new Container();
    app.stage.addChild(container);
    this.#container = container;
  }
  // Update logic for the renderer, called every frame with deltaTime for frame-independent updates
  _update(deltaTime) {
    this.#updateSprites(deltaTime);
  }
  #updateSprites(deltaTime){
    const ecs = engine.getECS();

    for(const eid of ecs.query('Transform', 'Sprite')){
      if(ecs.hasComponent(eid, 'PixiSprite')){
        // Already has a PixiSprite, just need to sync transform
        const transform = ecs.getComponent(eid, 'Transform');
        const pixiSpriteComp = ecs.getComponent(eid, 'PixiSprite');
        this.syncTransform(transform, pixiSpriteComp.ref);
      }
      else {
        // No PixiSprite yet, need to create one and add it to the container
        const transform = ecs.getComponent(eid, 'Transform');
        const spriteComp = ecs.getComponent(eid, 'Sprite');
        const texture = getTexture(spriteComp.textureId);
        if(texture == undefined){
          continue;
        }

        const pixiSprite = new Sprite(texture);
        this.syncTransform(transform, pixiSprite);

        this.#container.addChild(pixiSprite);
        ecs.addComponent(eid, 'PixiSprite', {ref: pixiSprite});
      }
    }
  }
  syncTransform(transform, pixiSprite){
    pixiSprite.x = transform.x;
    pixiSprite.y = transform.y;
    pixiSprite.rotation = transform.rotation;
    pixiSprite.zIndex = transform.zIndex;
    pixiSprite.width = pixiSprite.width * transform.scale.x;
    pixiSprite.height = pixiSprite.height * transform.scale.y;
  }
}

export const renderSystem = new RenderSystem();