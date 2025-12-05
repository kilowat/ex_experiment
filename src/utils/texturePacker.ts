import { GetSpriteOptions, ImageSource, Loadable, SourceView, Sprite, SpriteSheet } from "excalibur";


export interface TexturePackerData {
    frames: FrameElement[];
    meta: Meta;
}

interface FrameElement {
    filename: string;
    frame: SpriteSourceSize;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: SpriteSourceSize;
    sourceSize: Size;
    pivot: Pivot;
}

interface SpriteSourceSize {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Pivot {
    x: number;
    y: number;
}

interface Size {
    w: number;
    h: number;
}

interface Meta {
    app: string;
    version: string;
    image: string;
    format: string;
    size: Size;
    scale: number;
}

interface PackerFrame {
    filename: string,
    frame: {
        x: number,
        y: number,
        w: number,
        h: number
    },
}
interface PackerData {
    frames: [
        PackerFrame
    ]
}

interface sheetMap {
    [index: string]: number
}
export class TexturePackerSpriteSheet implements Loadable<PackerData> {
    private spriteSheet!: SpriteSheet;
    private sheetMap: sheetMap = {};
    private views: SourceView[] = [];
    private image!: ImageSource;

    constructor(public readonly data: PackerData, public readonly path: string) {
        for (let i = 0; i < data.frames.length; i++) {
            const frameData = data.frames[i];
            this.views.push({
                x: frameData.frame.x,
                y: frameData.frame.y,
                width: frameData.frame.w,
                height: frameData.frame.h,
            });

            this.sheetMap[frameData.filename] = i;
        }
        const image = new ImageSource(this.path);
        this.spriteSheet = SpriteSheet.fromImageSourceWithSourceViews({
            image,
            sourceViews: this.views,
        })
        this.image = image;
    }

    async load(): Promise<PackerData> {
        await this.image.load();
        return Promise.resolve(this.data);
    }

    isLoaded(): boolean {
        return this.image.isLoaded();
    }

    public getSprite(fileName: string, options?: GetSpriteOptions): Sprite {
        return this.spriteSheet.getSprite(this.sheetMap[fileName], 0, options);
    }
}