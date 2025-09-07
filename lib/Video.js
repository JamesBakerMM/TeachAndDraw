const RICK_ROLL = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;

/**
 * Holds a list of educational video links to be retrieved for various topics
 */
export class Video {
    static prefix = `TaD:`;
    static timer = {
        title: `${Video.prefix} Making a timer in TaD`,
        url: RICK_ROLL,
    };

    static loading = {
        title: `${Video.prefix} Common Loading Mistakes`,
        url: RICK_ROLL,
    };

    static drawStateStackSizeMismatch = {
        title: `${Video.prefix} Common Mistakes using .save(),.load() and .reset()`,
        url: RICK_ROLL,
    };

    static howToStoreCollidersInStorage = {
        title: `${Video.prefix} How to store Colliders in Teach and Draws Storage`,
        url: RICK_ROLL,
    };

    static NaN = {
        title: `${Video.prefix} What is a Nan?`,
        url: RICK_ROLL,
    };

    static undefined = {
        title: `${Video.prefix} Something is undefined!`,
        url: RICK_ROLL,
    };
}
