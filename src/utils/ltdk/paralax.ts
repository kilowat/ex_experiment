import * as ex from "excalibur"

export function createParallaxBackground(
    imagePath: string,
    parallaxFactor: number,
    engine: ex.Engine
) {
    const texture = new ex.ImageSource(imagePath);


    const actor = new ex.Actor({
        pos: ex.vec(0, 0),
        anchor: ex.vec(0, 0),
        z: -100
    });

    actor.graphics.use(
        new ex.Sprite({
            image: texture,
            width: engine.drawWidth,
            height: engine.drawHeight
        })
    );

    actor.on('preupdate', () => {
        actor.pos.x = engine.currentScene.camera.pos.x * parallaxFactor;
        actor.pos.y = engine.currentScene.camera.pos.y * parallaxFactor;
    });

    return actor;
}