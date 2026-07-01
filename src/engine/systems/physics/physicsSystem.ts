import { engine } from '../../engine.js';

let GRAVITY = 0.1; // Gravity constant, adjust as needed

export const SPATIAL_GRID_CELL_SIZE = 16; // Size of each cell in the spatial grid, adjust based on typical entity size
const spatialGrid = new Map<string, Array<number>>(); // <cellKey, entityIds[]>


class PhysicsSystem {
  _start(){

  }
  _update(deltaTime: number){
    const ecs = engine.getECS();

    this._applyExternalForces(deltaTime);
    this._updateSpatialGrid();


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
      if(!velocity.ignoreGravity){
        velocity.y += GRAVITY * deltaTime;
      }

      // Check for collisions before changing transform (?)
      const collider = ecs.getComponent(eid, 'Collider');
      if(collider){
        const futureX = transform.x + velocity.x;
        const futureY = transform.y + velocity.y;

        if(this.checkForCollisions(collider, futureX, transform.y)){
          velocity.x = 0; // Stop horizontal movement on collision
        }
        if(this.checkForCollisions(collider, transform.x, futureY)){
          velocity.y = 0; // Stop vertical movement on collision
        }
      }
      transform.x += velocity.x;
      transform.y += velocity.y;
    }
  }
  checkForCollisions(collider: any, testX: number, testY: number): boolean {
    //Checks if there would be a collision if the collider were at the testX and testY position. Returns true if a collision would occur.

    const ecs = engine.getECS();

    return false; //for now
  }

  _updateSpatialGrid(){
    const ecs = engine.getECS();

    for(const eid of ecs.query('Collider', 'Transform')){
      const transform = ecs.getComponent(eid, 'Transform');
      const collider = ecs.getComponent(eid, 'Collider');

      let coveredCells = this.getCoveredCells(transform, collider);
      // console.log(coveredCells, eid)
      
      // Update spatial grid with the entity's current cells
      for(const cellKey of coveredCells){
        if(!spatialGrid.has(cellKey)){
          spatialGrid.set(cellKey, []);
        }
        spatialGrid.get(cellKey)?.push(eid);
      }
    }
  }

  getCoveredCells(transform: any, collider: any): string[] {
    //Returns an array of cell keys that the collider currently occupies based on its transform and collider components.

    const spatialX = Math.floor(transform.x / SPATIAL_GRID_CELL_SIZE);
    const spatialY = Math.floor(transform.y / SPATIAL_GRID_CELL_SIZE);
    const start = [spatialX, spatialY];
    const end = [Math.floor(spatialX + (collider.width / SPATIAL_GRID_CELL_SIZE)), Math.floor(spatialY + (collider.height / SPATIAL_GRID_CELL_SIZE))];

    let cells = [];
    for(let y = start[1]; y <= end[1]; y++){
      for(let x = start[0]; x <= end[0]; x++){
        cells.push(`${x},${y}`);
      }
    }
    return cells;
  }
}


export const physicsSystem = new PhysicsSystem();