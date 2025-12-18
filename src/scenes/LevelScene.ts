
import { Player } from "actors/Player";
import { Scene, SceneActivationContext } from "excalibur";
import * as ex from "excalibur";
import { resources } from "resources";
import { IntGridColliderBuilder } from "utils/ltdk/IntGridColiderBuilder";

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
            const level = resources.ltdkMap.getLevel('Level_0');
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
                        console.log(actor)
                    }
                }
            ]
        }).build();

    }

    onActivate(context: SceneActivationContext<unknown>): void {

    }

    onDeactivate(context: SceneActivationContext): void {

    }
}

