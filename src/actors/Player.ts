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
        this.body.useGravity = true;
    }

    onPreUpdate(engine: ex.Engine, elapsedMs: number): void {
        // this.vel = ex.Vector.Zero;
        const kb = engine.input.keyboard;
        const speed = 150;

        if (kb.isHeld(ex.Keys.ArrowRight)) {
            this.vel.x = speed;
        }
        else if (kb.isHeld(ex.Keys.ArrowLeft)) {
            this.vel.x = -speed;
        }
        else {

            this.vel.x = 0;
        }
        //const grounded = this.body.contactNormals.some(n => n.y < 0);

        if (kb.wasPressed(ex.Keys.ArrowUp)) {
            this.vel.y = -200; // импульс вверх
        }

    }
}
