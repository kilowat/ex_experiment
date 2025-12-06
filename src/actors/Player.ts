// player.js (or player.ts)
import * as ex from 'excalibur';

export class Player extends ex.Actor {
    constructor(args: ex.ActorArgs) {
        super({
            ...args,
            collisionType: ex.CollisionType.Active,

        })

    }
    onInitialize(engine: ex.Engine) {
        this.color = ex.Color.Brown;
    }

    onPreUpdate(engine: ex.Engine, elapsed: number): void {

    }
}
