// ECS Scene class, manages entities and their components, provides methods for creating entities and adding/getting components
// Allows queries for entities with specific components, used by systems to operate on the data
// Data-oriented design, entities are just IDs, components hold data, and systems operate on the data

import { signal } from '../signal.js';

export class ECS {
  #components;
  #componentTypes;

  constructor() {
    this.nextId = 0;
    this.#components = new Map(); // <componentType, []>
    this.#componentTypes = new Map();
  }

  // Component Type Methods
  componentTypeExists(name){
    return this.#componentTypes.has(name);
  }

  registerComponentType(name, defaultData) {
    if(this.componentTypeExists(name)) {
      console.error(`[ECS] Component type '${name}' is already registered`);
      return;
    }
    this.#componentTypes.set(name, defaultData);
    this.#components.set(name, new Map());
  }


  // Entity Methods

  //Returns a new Entity ID and moves to the next, use this new entity id to compose an entity from a blank slate
  createEntity() { 
    const id = this.nextId++;
    return id;
  }

  // Deletes an entity and all of its components, should be used when you want to remove an entity from the scene, such as when an enemy dies
  destroyEntity(entityId) {
    signal.emit("ECS_EntityDestroyed", {entityId}); // Emit before cleanup so systems can react to the destruction
     
    for (const [key, value] of this.#componentTypes) {
      if(this.hasComponent(entityId, key)){
        this.removeComponent(entityId, key);
      }
    }
  }

  addComponent(entityId, componentType, modifiedData = {}) {
    if(!this.componentTypeExists(componentType)) {
      console.error(`[ECS] Component type '${componentType}' is not registered`);
      return;
    }
    if(this.#components.get(componentType)[entityId] !== undefined){
      console.error(`[ECS] Tried to add duplicate component '${componentType}' to entity with id '${entityId}'. Skipping.`);
      return;
    }

    const defaultData = this.#componentTypes.get(componentType);
    const componentData = { ...defaultData, ...modifiedData, entityId };

    this.#components.get(componentType).set(entityId, componentData);
    signal.emit("ECS_ComponentAdded", {entityId, componentType, componentData});
  }

  getComponent(entityId, componentType){
    if(!this.componentTypeExists(componentType)) {
      console.error(`[ECS] Component type '${componentType}' is not registered`);
      return;
    }
    return this.#components.get(componentType).get(entityId);
  }

  hasComponent(entityId, componentType){
    return this.getComponent(entityId, componentType) !== undefined;
  }

  removeComponent(entityId, componentType) {
    if(!this.componentTypeExists(componentType)) {
      console.error(`[ECS] Component type '${componentType}' is not registered`);
      return;
    }
    if(!this.hasComponent(entityId, componentType)){
      console.error(`[ECS] Entity with id '${entityId}' does not have component '${componentType}'. Skipping.`);
      return;
    }
    this.#components.get(componentType).delete(entityId);
    signal.emit("ECS_ComponentRemoved", {entityId, componentType});
  }

  getAllComponents(entityId){
    let result = [];
    for (const [key, value] of this.#componentTypes) {
      if(this.hasComponent(entityId, key)){
        result.push(key);
      }
    }
    return result;
  }

  // QUERY THE ECS FOR ENTITIES
  // returns all entity IDs that have ALL of the requested component types
  query(...types){
    const start = performance.now()
    const result = [];

    // Gets the data Map of all specified component types
    let componentMaps = types.map((type) => {
      if(!this.componentTypeExists(type)) {
        throw new Error(`[ECS] Component type '${type}' is not registered.`);
      }
      return this.#components.get(type);
    });

    // Sort maps by size, iterate the smallest
    componentMaps.sort((a, b) => a.size - b.size);
    const [smallest, ...rest] = componentMaps;


    for (const key of smallest.keys()) {
      if (rest.every(map => map.has(key))) {
        result.push(key);
      }
    }

    // console.log(`Did query in ${performance.now() - start}ms`)
    return result;
  }
}