import { Assets } from "pixi.js";

let textures = {};

// Takes an assets object with the format <"id":"url">
export async function loadTextures(assetsObject, sharpRendering = false){

  if(assetsObject == undefined || Object.entries(assetsObject) == undefined){
    console.error(`AssetsManager: Tried to load an invalid texture list object. Aborting.`);
    return;
  }

  for (const [key, value] of Object.entries(assetsObject)) {
    const texture = await Assets.load(value);
    if(texture == undefined){
      console.warn(`AssetsManager: Failed to load texture with id "${key}" from url "${value}". Skipping.`);
      continue;
    }
    if(sharpRendering){
      texture.source.scaleMode = 'nearest';
    }
    textures[key] = texture;
  }
}

export function getTexture(id){
  return textures[id];
}