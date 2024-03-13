
// /**
//  * In charge of tracking time related elements, holding time based methods and properties etc
//  * This includes the fps stuff currently as its tightly related
//  */
export class TimeManager {
    constructor() {
        this.frameCount = -1; // Current frame count
        this.fps = 60; // Target FPS
        this.msPerFrame = 1000 / this.fps;
        this.elapsedMsSum = 0; // Sum of elapsed time over a series of frames
        this.averageFps = 60; // Initialize with a sensible default
        this.msThen=window.performance.now();
        this.msElapsed=1;
        this.secondsElapsed=0.0;
    }
    update() {
        const now = window.performance.now();
        const msElapsed = now - this.msThen; 
        this.secondsElapsed += this.msElapsed / 1000;

        this.elapsedMsSum += msElapsed; 
        this.frameCount++;

        if (this.frameCount % 60 === 0) { // Every 60 frames, calculate average FPS
            const averageFrameTime = this.elapsedMsSum / 60;
            this.averageFps = 1000 / averageFrameTime;
            this.elapsedMsSum = 0; // Reset sum
        }

        this.msThen = now; // Update timestamp for next frame
    }
}
