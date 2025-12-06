
import {
    DisplayMode,
    Engine,
    EngineOptions,
    SolverStrategy,
    vec
} from "excalibur";
import * as ex from "excalibur";

import { loader, resources } from "resources";
import { LevelScene } from "scenes/LevelScene";
import { StartScene } from "scenes/StartScene";
import { UILayout } from "ui/UILayout";
import { showUI } from "utils/ui";

const gameOptions: EngineOptions = {
    suppressPlayButton: true,
    displayMode: DisplayMode.FitScreen,
    canvasElementId: 'game',
    physics: {
        solver: SolverStrategy.Arcade,
        gravity: vec(0, 800),
    },
    scenes: {
        [StartScene.route]: {
            scene: StartScene,
        },
        [LevelScene.route]: {
            scene: LevelScene,
        },
    }
};

export const game = new Engine(gameOptions);

const calculateExPixelConversion = (screen: ex.Screen, engine: Engine) => {
    const pagePos = screen.screenToPageCoordinates(vec(0, 0));

    const screenWidth = screen.viewport.width;
    const screenHeight = screen.viewport.height;

    const cam = engine.currentScene.camera;
    const camWidth = cam.viewport.width;
    const camHeight = cam.viewport.height;

    const camPos = cam.pos;
    const root = document.documentElement.style;

    root.setProperty("--screen-x", `${pagePos.x}px`);
    root.setProperty("--screen-y", `${pagePos.y}px`);

    // Размер канваса (экран)
    root.setProperty("--screen-width", `${screenWidth}px`);
    root.setProperty("--screen-height", `${screenHeight}px`);

    // Размер вьюпорта камеры
    root.setProperty("--camera-width", `${camWidth}px`);
    root.setProperty("--camera-height", `${camHeight}px`);

    // Позиция центра камеры (в игровых координатах)
    root.setProperty("--camera-x", `${camPos.x}px`);
    root.setProperty("--camera-y", `${camPos.y}px`);
};

game.screen.events.on("resize", () => calculateExPixelConversion(game.screen, game));

game.start(loader).then(() => {
    calculateExPixelConversion(game.screen, game);
    document.getElementById('ui')?.classList.remove('--hide');
    showUI(UILayout());
    game.goToScene(LevelScene.route);
});

