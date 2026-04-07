let runOnce = false;

// Registers the default basic engine components
export function registerDefaultComponents(ecs){
  if(runOnce === true){
    return;
  }

  // basic components
  ecs.registerComponentType('Transform', {x: 0, y: 0, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});

  // rendering components
  ecs.registerComponentType('Sprite', {width: 0, height: 0, textureId: "no_sprite"});
  ecs.registerComponentType('PixiSprite', {ref: null});

  // physics components

  // NOTE: Collider friction defines the Velocity reduction applied when an entity is in direct contact with another collider. 0.85 means velocity will be reduced to 85% of its value every frame while colliding.
  ecs.registerComponentType('Collider', {width: 0, height: 0, ignorePhysics: false, friction: 0.85}); 
  ecs.registerComponentType('Velocity', {x: 0, y: 0, weight: 1});

  runOnce = true;
}