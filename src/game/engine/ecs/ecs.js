// ECS Scene class, manages entities and their components, provides methods for creating entities and adding/getting components
// Allows queries for entities with specific components, used by systems to operate on the data
// Data-oriented design, entities are just IDs, components hold data, and systems operate on the data

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
    this.#components.set(name, []);
  }


  // Entity Methods

  //Returns a new Entity ID and moves to the next, use this new entity id to compose an entity from a blank slate
  createEntity() { 
    const id = this.nextId++;
    return id;
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

    this.#components.get(componentType)[entityId] = componentData;
  }

  getComponent(entityId, componentType){
    if(!this.componentTypeExists(componentType)) {
      console.error(`[ECS] Component type '${componentType}' is not registered`);
      return;
    }
    return this.#components.get(componentType)[entityId];
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
    this.#components.get(componentType)[entityId] = undefined;
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
}