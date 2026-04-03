export class Camera {
  constructor(PixiApp, PixiContainer){
    this.x = 0;
    this.y = 0;
    this.zoom = 1;

    this.PixiContainer = PixiContainer;
    this.PixiApp = PixiApp;
  }
  _update(deltaTime){
    this.PixiContainer.x = -this.x;
    this.PixiContainer.y = -this.y;
    this.PixiContainer.scale.set(this.zoom);
  }
  setZoom(level, centerX = 0, centerY = 0){
    this.x = (centerX * level) - (this.PixiApp.renderer.width / 2);
    this.y = (centerY * level ) - (this.PixiApp.renderer.height / 2);
    this.zoom = level;
  }
}