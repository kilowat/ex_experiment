
import { ImageSource, Loader, Sound, } from "excalibur";
import farmMusicPath from './assets/apple_cider.ogg'
import { LdtkResource } from "@excaliburjs/plugin-ldtk";
import ltdkMainSrc from "./assets/editor/main.ldtk";
import level0Src from "./assets/editor/main/Level_0.ldtkl";
import twilightTilesSrc from './assets/sprites/twilight-tiles.png';
import exteriorParallaxBG1Src from './assets/sprites/exterior-parallaxBG1.png';
import exteriorParallaxBG2Src from './assets/sprites/exterior-parallaxBG2.png';


export const resources = {
    farmMusic: new Sound(farmMusicPath),
    ltdkMap: new LdtkResource(ltdkMainSrc, {
        useTilemapCameraStrategy: true,
        // useMapBackgroundColor: true,
        // Path map intercepts and redirects to work around parcel's static bundling
        pathMap: [
            { path: 'Level_0.ldtkl', output: level0Src },
            { path: 'twilight-tiles', output: twilightTilesSrc },
            { path: 'exterior-parallaxBG1.png', output: exteriorParallaxBG1Src },
            { path: 'exterior-parallaxBG2.png', output: exteriorParallaxBG2Src },
        ]
    }),
    exteriorParallaxBG1Src: new ImageSource(exteriorParallaxBG1Src),
    exteriorParallaxBG2Src: new ImageSource(exteriorParallaxBG2Src),
} as const

export const loader = new Loader();

for (let resource of Object.values(resources)) {
    loader.addResource(resource);
}