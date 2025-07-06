// /**
//  * In charge of tracking time related elements, holding time based methods and properties etc
//  * This includes the fps stuff currently as its tightly related
//  */
export class TimeManager {

    #wholeSecondsElapsed;
    #fractSecondsElapsed;

    constructor() {
        this.MAX_TIME_MULTIPLIER = 0.7;
        this.frameCount = -1; // set to -1 initially an indicator for the first frame to do setup, load presentation etc
        this.fps = 60; // Target FPS
        this.msPerFrame = 1000 / this.fps;
        this.elapsedMsSum = 0;
        this.averageFps = 60;
        this.msThen = window.performance.now();
        this.msElapsed = 1;
        this.#wholeSecondsElapsed = 0;
        this.#fractSecondsElapsed = 0.0;
        this.timeMultiplier = 1.0;
        Object.seal(this);
    }
    update() {
        const now = window.performance.now();
        this.msElapsed = now - this.msThen;
        if (this.msElapsed / 100 <= this.MAX_TIME_MULTIPLIER) {
            this.timeMultiplier = this.msElapsed / 100;
        } else {
            this.timeMultiplier = this.MAX_TIME_MULTIPLIER;
        }

        this.elapsedMsSum += this.msElapsed;
        this.frameCount++;

        if (this.frameCount % 60 === 0) {
            const averageFrameTime = this.elapsedMsSum / 60;
            this.averageFps = 1000 / averageFrameTime;
            this.elapsedMsSum = 0;
        }

        this.msThen = now; // Update timestamp for next frame


        this.#fractSecondsElapsed += this.msElapsed / 1000;
        while (this.#fractSecondsElapsed > 1.0) // while loop in case fractSecondsElapsed > 2.0
        {
            this.#wholeSecondsElapsed = Math.floor(this.#wholeSecondsElapsed+1);
            this.#fractSecondsElapsed -= 1.0;
        }
    }

    get secondsElapsed() {
        return this.#wholeSecondsElapsed;
    }

}
