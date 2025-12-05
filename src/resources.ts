
import { Loader, Sound, } from "excalibur";
import farmMusicPath from './assets/apple_cider.ogg'

export const resources = {
    farmMusic: new Sound(farmMusicPath)
} as const

export const loader = new Loader();

for (let resource of Object.values(resources)) {
    loader.addResource(resource);
}