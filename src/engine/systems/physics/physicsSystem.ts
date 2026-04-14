import { engine } from '../../engine.js';

let GRAVITY = 0.1; // Gravity constant, adjust as needed

const SPATIAL_GRID_CELL_SIZE = 16; // Size of each cell in the spatial grid, adjust based on typical entity size
const spatialGrid = new Map<string, number>(); // <cellKey, entityId>


class PhysicsSystem {
  _start(){

  }
  _update(deltaTime: number){
    const ecs = engine.getECS();

    this._applyExternalForces(deltaTime);

    for(const eid of ecs.query('Collider')){
    }
  }
  _applyExternalForces(deltaTime: number){
    const ecs = engine.getECS();

    for(const eid of ecs.query('Velocity', 'Transform')){
      const velocity = ecs.getComponent(eid, 'Velocity');
      const transform = ecs.getComponent(eid, 'Transform');

      if(velocity === undefined) continue;
      
      // Apply gravity to vertical velocity
      velocity.y += GRAVITY * deltaTime;

      // Check for collisions before changing transform (?)
      const collider = ecs.getComponent(eid, 'Collider');
      if(collider){
        const futureX = transform.x + velocity.x;
        const futureY = transform.y + velocity.y;

        if(this._checkForCollisions(collider, futureX, transform.y)){
          velocity.x = 0; // Stop horizontal movement on collision
        }
        if(this._checkForCollisions(collider, transform.x, futureY)){
          velocity.y = 0; // Stop vertical movement on collision
        }
      }
      transform.x += velocity.x;
      transform.y += velocity.y;
    }
  }
  _checkForCollisions(collider: any, testX: number, testY: number): boolean {
    //Checks if there would be a collision if the collider were at the testX and testY position. Returns true if a collision would occur.
    
    const ecs = engine.getECS();

    return false; //for now
  }
}


export const physicsSystem = new PhysicsSystem();