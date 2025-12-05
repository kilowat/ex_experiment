import { computed, signal } from "@preact/signals";

const time = signal(0);
const timeFormatted = computed(() => time.value.toFixed(2));

export const GameState = {
    system: {
        time,
        timeFormatted,
    },
    game: {
        isPlaying: signal(false),
    }
}

