
import { Player } from "actors/Player";
import { Scene, SceneActivationContext } from "excalibur";
import * as ex from "excalibur";
import { resources } from "resources";
import { IntGridColliderBuilder } from "utils/ltdk/IntGridColiderBuilder";
import { createParallaxBackground } from "utils/ltdk/paralax";

export class LevelScene extends Scene {
    static route = 'level';

    onInitialize(engine: ex.Engine): void {
        resources.ltdkMap.registerEntityIdentifierFactory('PlayerStart', (props) => {
            const player = new Player({
                name: 'player',
                color: ex.Color.Red,
                anchor: ex.vec(props.entity.__pivot[0], props.entity.__pivot[1]),
                width: props.entity.width,
                height: props.entity.height,
                pos: props.worldPos,
                z: props.layer.order
            });
            return player;
        });
        // Provide a type to the plugin to use for a specific entity identifier
        // Player.ts
        resources.ltdkMap.addToScene(this, {
            pos: ex.vec(0, 0),
            levelFilter: ['Level_0']
        });
        const player = this.world.entityManager.getByName('player')[0];
        //this.add(player);

        if (player instanceof Player) {
            //this.camera.clearAllStrategies();
            this.camera.strategy.lockToActor(player);

            const bounds = resources.ltdkMap.getLevelBounds(['Level_0']);
            this.camera.strategy.limitCameraBounds(bounds);
            this.add(player);
        }
        const block = new ex.Actor({
            width: 10,
            height: 10,
            color: ex.Color.Green,
            collisionType: ex.CollisionType.Fixed,
            pos: ex.vec(32, 240)
        })
        this.add(block)

        const intGrid = resources.ltdkMap.getIntGridLayers("level_0")[0];

        new IntGridColliderBuilder(intGrid, this, {
            filterValues: [1, 2],
            decorators: [
                (actor) => {
                    actor.tags.add("floor");
                },
                (actor, ctx) => {
                    if (ctx.chunk.value === 2) {
                        //to do
                    }
                }
            ]
        }).build();
        const level = resources.ltdkMap.getLevel('Level_0')?.ldtkLevel!;

        //const bgNewaImage = level.fieldInstances.find(f => f.__identifier === 'BG_NEAR')?.__value;
        const bgNewaImage = resources.exteriorParallaxBG1Src;
        const bgNearParalxVlue = level.fieldInstances.find(f => f.__identifier === 'BG_NEAR_PARALAX')?.__value ?? 0.2

        console.log(engine.screen.drawWidth);
        console.log(this.camera.viewport.width);
        const bounds = resources.ltdkMap.getLevelBounds(['Level_0']);
        const bg = new ex.Actor({
            anchor: ex.vec(0, 0),
            pos: ex.vec(0, 0),
            z: -10
        });

        const tiled = new ex.TiledSprite({
            image: bgNewaImage,
            width: this.camera.viewport.width,
            height: this.camera.viewport.height
        });

        bg.graphics.use(tiled);

        this.camera.on('postupdate', () => {
            const vp = this.camera.viewport;
            bg.pos.setTo(vp.left, vp.top);
            tiled.width = vp.width;
            tiled.height = vp.height;
        });


        // bg.addComponent(new ex.ParallaxComponent(ex.vec(0.1, 0.6)))
        this.add(bg);

    }

    onActivate(context: SceneActivationContext<unknown>): void {

    }

    onDeactivate(context: SceneActivationContext): void {

    }
}

