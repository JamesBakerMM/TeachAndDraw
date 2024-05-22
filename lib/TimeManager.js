
// /**
//  * In charge of tracking time related elements, holding time based methods and properties etc
//  * This includes the fps stuff currently as its tightly related
//  */
export class TimeManager {
    static MAX_TIME_MULTIPLIER=0.7;
    constructor() {
        this.frameCount = -1; // set to -1 initially an indicator for the first frame to do setup, load presentation etc
        this.fps = 60; // Target FPS
        this.msPerFrame = 1000 / this.fps;
        this.elapsedMsSum = 0; 
        this.averageFps = 60;
        this.msThen=window.performance.now();
        this.msElapsed=1;
        this.secondsElapsed=1.0;
        this.timeMultiplier=1.0;
        Object.seal(this);
    }
    update() {
        const now = window.performance.now();
        this.msElapsed=now - this.msThen; 
        this.secondsElapsed = this.msElapsed / 1000;
        this.timeMultiplier = this.msElapsed / 100;
        if(this.timeMultiplier>TimeManager.MAX_TIME_MULTIPLIER){
            this.timeMultiplier=TimeManager.MAX_TIME_MULTIPLIER;
        }

        this.elapsedMsSum += this.msElapsed; 
        this.frameCount++;

        if (this.frameCount % 60 === 0) { 
            const averageFrameTime = this.elapsedMsSum / 60;
            this.averageFps = 1000 / averageFrameTime;
            this.elapsedMsSum = 0;
        }

        this.msThen = now; // Update timestamp for next frame
    }
}
