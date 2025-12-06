
import { Loader, Sound, } from "excalibur";
import farmMusicPath from './assets/apple_cider.ogg'
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import ltdkMainSrc from "./assets/editor/main.ldtk";

export const resources = {
    farmMusic: new Sound(farmMusicPath),
    ltdkMap: new LdtkResource(ltdkMainSrc),
} as const

export const loader = new Loader();

for (let resource of Object.values(resources)) {
    loader.addResource(resource);
}