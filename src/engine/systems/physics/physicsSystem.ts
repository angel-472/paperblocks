import { engine } from '../../engine.js';

const GRAVITY = 0.1; // Gravity constant, adjust as needed
export const SPATIAL_GRID_CELL_SIZE = 16; // Size of each cell in the spatial grid, adjust based on typical entity size

type CollisionResult = {
  result: boolean,
  found: any | undefined
}

class PhysicsSystem {
  spatialGrid;
  spatialGridCellSize;

  constructor(){
    this.spatialGrid = new Map<string, Set<number>>(); // <cellKey, entityIds<>>
    this.spatialGridCellSize = SPATIAL_GRID_CELL_SIZE;
  }
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

      // Apply friction to velocity
      const AIR_FRICTION = 0.025;
      if(velocity.x > 0){
        velocity.x = Math.max(0, velocity.x - (AIR_FRICTION * deltaTime));
      }
      else{
        velocity.x = Math.min(0, velocity.x + (AIR_FRICTION * deltaTime))
      }

      // Check for collisions before changing transform (?)
      const collider = ecs.getComponent(eid, 'Collider');
      if(collider){
        const futureX = transform.x + velocity.x;
        const futureY = transform.y + velocity.y;

        const horizontalCollCheck = this.checkForCollisions(collider, transform, futureX, transform.y);
        const verticalCollCheck = this.checkForCollisions(collider, transform, transform.x, futureY);

        if(horizontalCollCheck.result == true){
          velocity.x = 0; // Stop horizontal movement on collision
          // console.log('x velocity collision')
        }
        if(verticalCollCheck.result == true){
          velocity.y = 0; // Stop vertical movement on collision
          const found = verticalCollCheck.found;
        }
      }

      // Apply the movement change
      transform.x += velocity.x;
      transform.y += velocity.y;
    }
  }
  checkForCollisions(collider: any, transform: any, testX: number, testY: number): CollisionResult {
    //Checks if there would be a collision if the collider were at the testX and testY position. Returns true if a collision would occur.

    const ecs = engine.getECS();

    let futureTransform = structuredClone(transform)
    futureTransform.x = testX;
    futureTransform.y = testY;

    const futureCoveredCells = this.getCoveredCells(futureTransform, collider);
    
    for(const cellKey of futureCoveredCells){
      const entityIds = this.spatialGrid.get(cellKey);

      if(entityIds === undefined) continue;

      for(const eid of entityIds){
        if(eid === collider.entityId) continue;

        // console.log("Shared space :o")
        // TODO: Axis-Aligned Bounding Box (AABB) collision detection between concerned collider and entity that shares the cell  
        const otherCollider = ecs.getComponent(eid, 'Collider');
        const otherTransform = ecs.getComponent(eid, 'Transform');

        if(otherCollider == undefined || otherTransform == undefined) continue;

        if(
          futureTransform.x < otherTransform.x + otherCollider.width &&
          futureTransform.x + collider.width > otherTransform.x &&
          futureTransform.y < otherTransform.y + otherCollider.height &&
          futureTransform.y + collider.height > otherTransform.y
        ){
          return {result: true, found: {collider: otherCollider, transform: otherTransform}};
        }
      }
    }

    return {result: false, found: {}}; //for now
  }

  _updateSpatialGrid(){
    const ecs = engine.getECS();

    for(const eid of ecs.query('Collider', 'Transform')){
      const transform = ecs.getComponent(eid, 'Transform');
      const collider = ecs.getComponent(eid, 'Collider');

      if(collider.coveredCells !== undefined){
        for(const cellKey of collider.coveredCells){

          const gridCellSet = this.spatialGrid.get(cellKey);

          if(gridCellSet === undefined) continue;

          gridCellSet.delete(eid);

          // get rid of empty sets to avoid memory leak
          if(gridCellSet.size <= 0){
            this.spatialGrid.delete(cellKey);
          }
        }
      }

      let coveredCells = this.getCoveredCells(transform, collider);
      collider.coveredCells = coveredCells;
      
      // Update spatial grid with the entity's current cells
      for(const cellKey of coveredCells){
        if(!this.spatialGrid.has(cellKey)){
          this.spatialGrid.set(cellKey, new Set());
        }
        this.spatialGrid.get(cellKey)?.add(eid);
      }
    }
  }

  getCoveredCells(transform: any, collider: any): string[] {
    //Returns an array of cell keys that the collider currently occupies based on its transform posiiton and collider size

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