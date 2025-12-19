
import { Player } from "actors/Player";
import { Scene, SceneActivationContext } from "excalibur";
import * as ex from "excalibur";
import { resources } from "resources";
import { intGridBuilder } from "utils/ltdk/intGridBuilder";

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
            // this.camera.clearAllStrategies();
            this.camera.strategy.lockToActor(player);

            // this.camera.strategy.radiusAroundActor(player, 100,);

            const bounds = resources.ltdkMap.getLevelBounds(['Level_0']);
            this.camera.strategy.limitCameraBounds(bounds);
            this.add(player);
        }

        const intGrid = resources.ltdkMap.getIntGridLayers("level_0")[0];

        intGridBuilder({
            layer: intGrid,
            onBuild: (actor) => this.add(actor)
        })

        const level = resources.ltdkMap.getLevel('Level_0')?.ldtkLevel!;

        //const bgNewaImage = level.fieldInstances.find(f => f.__identifier === 'BG_NEAR')?.__value;
        const bgNear = resources.exteriorParallaxBG1Src;
        const bgNearParalxVlue = level.fieldInstances.find(f => f.__identifier === 'BG_NEAR_PARALAX')?.__value ?? 0.2

        const bounds = resources.ltdkMap.getLevelBounds(['Level_0']);
        const bgNearActor = new ex.Actor({
            anchor: ex.vec(0, 0),
            pos: ex.vec(-bounds.width, 0),
            z: -10
        });

        const tiled = new ex.TiledSprite({
            image: bgNear,
            width: bounds.width * 2,
            height: this.camera.viewport.height
        });

        bgNearActor.graphics.use(tiled);

        bgNearActor.addComponent(new ex.ParallaxComponent(ex.vec(0.2, 1)))
        this.add(bgNearActor);



        const bgFarActor = new ex.Actor({
            anchor: ex.vec(0, 0),
            pos: ex.vec(-100, 0),
            z: -9
        });

        const bgFarSprite = new ex.Sprite({
            image: resources.exteriorParallaxBG2Src,
            width: this.camera.viewport.width,
            height: this.camera.viewport.height
        });

        bgFarActor.graphics.use(bgFarSprite);

        bgFarActor.addComponent(new ex.ParallaxComponent(ex.vec(0.1, 1)))
        this.add(bgFarActor);


    }

    onActivate(context: SceneActivationContext<unknown>): void {

    }

    onDeactivate(context: SceneActivationContext): void {

    }
}

