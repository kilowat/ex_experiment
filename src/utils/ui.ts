import { Sprite } from "excalibur";
import { render } from "preact";

export function showUI(component: any, root: HTMLElement | null = null) {
    const rootElement = root != null ? root : document.querySelector("#ui")!;
    render(component, rootElement);
}

export function clearUI(root: HTMLElement | null = null) {
    const rootElement = root != null ? root : document.querySelector("#ui")!;
    render(null, rootElement);
}
