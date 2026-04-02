let runOnce = false;

// Registers the default basic engine components
export function registerDefaultComponents(ecs){
  if(runOnce === true){
    return;
  }

  ecs.registerComponentType('Transform', {x: 0, y: 0, rotation: 0, zIndex: 0, scale: {x: 1, y: 1}});
  ecs.registerComponentType('Area', {width: 0, height: 0});
  ecs.registerComponentType('Sprite', {width: 0, height: 0, imageUrl: "/assets/no_sprite.png"});

  runOnce = true;
}