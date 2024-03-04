
/**
 * In charge of tracking time related elements, holding time based methods and properties etc
 * This includes the fps stuff currently as its tightly related
 */
export class TimeManager {
    #frameTimes
    constructor(){
        this.frameCount=-1; //current frame
        this.fps = 60; // Target FPS
        this.msPerFrame = 1000 / this.fps; // Interval in milliseconds
        this.msThen=window.performance.now();
        this.msElapsed=1;
        this.secondsElapsed=0.0;
        this.averageFps=1;
        this.#frameTimes=[];
    }
    update(){
        this.frameCount++
        
        this.msElapsed=window.performance.now()-this.msThen;
        if(this.msElapsed===0){
            this.msElapsed=1;
        }
        this.secondsElapsed += this.msElapsed / 1000;
        this.msThen=window.performance.now();
        
        this.fpsAverage();
    }
    fpsAverage(){
        this.#frameTimes.push(this.msElapsed);
        
        const twoSeconds= this.fps*2
        if (this.#frameTimes.length > twoSeconds) { // Keep last 2 seconds of frame times
            this.#frameTimes.shift();
        }

        const averageFrameTime = this.#calculateAverage(this.#frameTimes);
        this.averageFps = 1000 / averageFrameTime;
    }
    #calculateAverage(arr) {
        let sum = 0;
        if (arr.length === 0) {
            return 0;
        }
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum / arr.length;
    }
}