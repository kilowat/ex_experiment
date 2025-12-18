import { IntGridLayer } from "@excaliburjs/plugin-ldtk";
import { Actor, CollisionType, Color, Scene, vec, Vector } from "excalibur";


export interface IntGridColliderChunk {
    value: number;
    x: number;      // tile coordinate
    y: number;
    width: number;  // tiles
    height: number; // tiles
}

export interface IntGridColliderContext {
    layer: IntGridLayer;
    chunk: IntGridColliderChunk;
    worldPos: Vector;
    tileSize: number;
}

export type IntGridColliderDecorator = (
    actor: Actor,
    context: IntGridColliderContext
) => void;

export type IntGridColliderFactory = (
    context: IntGridColliderContext
) => Actor | undefined;


export function mergeIntGrid(layer: IntGridLayer): IntGridColliderChunk[] {
    const { intGridCsv, __cWid, __cHei } = layer.ldtkLayer;
    const visited = new Set<number>();
    const chunks: IntGridColliderChunk[] = [];

    const index = (x: number, y: number) => y * __cWid + x;

    for (let y = 0; y < __cHei; y++) {
        for (let x = 0; x < __cWid; x++) {
            const i = index(x, y);
            const value = intGridCsv[i];
            if (!value || visited.has(i)) continue;

            // find max width
            let width = 1;
            while (
                x + width < __cWid &&
                intGridCsv[index(x + width, y)] === value &&
                !visited.has(index(x + width, y))
            ) {
                width++;
            }

            // find max height
            let height = 1;
            outer: while (y + height < __cHei) {
                for (let dx = 0; dx < width; dx++) {
                    if (
                        intGridCsv[index(x + dx, y + height)] !== value ||
                        visited.has(index(x + dx, y + height))
                    ) {
                        break outer;
                    }
                }
                height++;
            }

            // mark visited
            for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                    visited.add(index(x + dx, y + dy));
                }
            }

            chunks.push({ value, x, y, width, height });
        }
    }

    return chunks;
}


export const DefaultIntGridColliderFactory: IntGridColliderFactory = ({
    chunk,
    tileSize,
    worldPos
}) => {
    const widthPx = chunk.width * tileSize;
    const heightPx = chunk.height * tileSize;

    const actor = new Actor({
        pos: vec(
            worldPos.x + chunk.x * tileSize + widthPx / 2,
            worldPos.y + chunk.y * tileSize + heightPx / 2
        ),
        width: widthPx,
        height: heightPx,
        collisionType: CollisionType.Fixed
    });


    return actor;
};

export interface IntGridColliderBuilderOptions {
    factory?: IntGridColliderFactory;
    decorators?: IntGridColliderDecorator[];
    filterValues?: number[];
}

export class IntGridColliderBuilder {
    constructor(
        private layer: IntGridLayer,
        private scene: Scene,
        private options: IntGridColliderBuilderOptions = {}
    ) { }

    build() {
        const {
            factory = DefaultIntGridColliderFactory,
            decorators = [],
            filterValues
        } = this.options;

        const chunks = mergeIntGrid(this.layer);

        for (const chunk of chunks) {
            if (filterValues && !filterValues.includes(chunk.value)) continue;

            const actor = factory({
                layer: this.layer,
                chunk,
                tileSize: this.layer.ldtkLayer.__gridSize,
                worldPos: this.layer.tilemap.pos
            });

            if (!actor) continue;

            for (const decorator of decorators) {
                decorator(actor, {
                    layer: this.layer,
                    chunk,
                    tileSize: this.layer.ldtkLayer.__gridSize,
                    worldPos: this.layer.tilemap.pos
                });
            }

            this.scene.add(actor);
        }
    }
}