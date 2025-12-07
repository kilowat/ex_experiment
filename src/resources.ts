
import { Loader, Sound, } from "excalibur";
import farmMusicPath from './assets/apple_cider.ogg'
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import ltdkMainSrc from "./assets/editor/main.ldtk";
import level0Src from "./assets/editor/main/Level_0.ldtkl";
import twilightTilesSrc from './assets/sprites/twilight-tiles.png';

export const resources = {
    farmMusic: new Sound(farmMusicPath),
    ltdkMap: new LdtkResource(ltdkMainSrc, {
        useTilemapCameraStrategy: true,
        // useMapBackgroundColor: true,
        // Path map intercepts and redirects to work around parcel's static bundling
        pathMap: [
            { path: 'Level_0.ldtkl', output: level0Src },
            { path: 'twilight-tiles', output: twilightTilesSrc },
        ]
    }),
} as const

export const loader = new Loader();

for (let resource of Object.values(resources)) {
    loader.addResource(resource);
}