import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Group } from "./Group.js";
import { $ } from "./Pen.js";



export class MetricBase {
    #rate = 60;
    timer = 0;

    /**
     * @param {number} rate Desired tick rate in frames. metric.measurePerformance will be called
     * every rate frames.
     * @throws {Error} If rate is not a finite number.
     */
    set rate( rate ) {
        if (rate <= 0 || Number.isFinite(rate) == false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(
                    rate, `rate must be a finite, positive number!`
                )
            );
        }
        this.#rate = rate;
    }
    
    /**
     */
    get rate() {
        return this.#rate;
    }

    /** Make a performance measurement. 
     * @returns {Object} Performance measurement.
     */
    measurePerformance() { throw Error("Derived class must define measurePerformance!"); };

    /** Compute trend data from the history buffer.
     * @param {Array<Object>} history
     * @returns {Object} trends
     */
    computeTrends( history ) { throw Error("Derived class must define computeTrends!"); };

    /** Print measurement data in a nicely-formatted way.
     * @param {Object} measurement
     */
    printMeasurement( measurement ) { throw Error("Derived class must define printMeasurement!"); };

    /** Print trend data in a nicely-formatted way.
     * @param {Object} trends
     */
    printTrends( trends ) { throw Error("Derived class must define printTrends!"); };
}


/**
 * @property {Date} date Date/time the data was measured/computed.
 * @property {Object} data Object which maps metric name to the metric's measured/computed data.
 */
class PerformanceState {
    constructor() {
        this.date = new Date();
        this.data = {};
    }
}


/**
 * @property {number} maxHistoryBufferLength Maximum number of performance measurements to keep
 * in local storage.
 */
export class PerformanceMetrics {
    static maxHistoryBufferLength = 512;

    /**Stores an instance of each performance metric (derived from MetricBase class).
     * @type {Object}
    */
    #metrics;

    /**History buffer which stores the result of the previous maxHistoryBufferLength calls to
     * PerformanceMetrics.measurePerformance. Loaded from localStorage it exists, otherwise
     * initialized to an empty array.
     * @type {Array<PerformanceState>} 
    */
    #history;

    constructor() {
        this.#metrics = {};
        this.addMetric(new MetricGroupVsArray());
        this.addMetric(new MetricFramerate());

        // localStorage.clear();
        const json = localStorage.getItem("PerformanceMetrics");
        if (json === null) {
            this.#history = [];
        } else {
            this.#history = JSON.parse(json);
        }
    }

    /**Add a performance metric.
     * This exists so other parts of the libary can define their own metrics privately.
     * For example, some metrics may be too expensive to measure every frame. These metrics
     * could be added to take measurements before being removed after some time.
     * @param {MetricBase} metric Instance of class derived from MetricBase.
     * @throws {Error} If metric is not derived from MetricBase.
     * @throws {Error} If metric is already managed by this object.
     */
    addMetric( metric ) {
        const key = metric.constructor.name;
        if (!(metric instanceof MetricBase)) {
            throw Error(
                `${key} is not derived from MetricBase!`
            );
        }
        if (this.#metrics[key] !== undefined) {
            throw Error(
                `Cannot add metric "${key} as it already exists!"`
            )
        }
        this.#metrics[key] = metric
    }

    /**Remove a performance metric.
     * This exists so other parts of the libary can define their own metrics privately.
     * For example, some metrics may be too expensive to measure every frame. These metrics
     * could be added to take measurements before being removed after some time.
     * @param {MetricBase} metric Instance of class derived from MetricBase.
     * @throws {Error} If metric is not derived from MetricBase.
     * @throws {Error} If metric is not managed by this object.
     */
    removeMetric( metric ) {
        const key = metric.constructor.name;
        if (!(metric instanceof MetricBase)) {
            throw Error(
                `${key} is not derived from MetricBase!`
            );
        }
        if (this.#metrics[key] === undefined) {
            throw Error(
                `Cannot remove metric "${key} as it does not exist!"`
            );
        }
        this.#metrics[key] = undefined;
    }

    /**
     * Push measurement data onto history buffer and place in localStorage.
     * The first element of the history buffer will be removed if its length exceeds
     * PerformanceMetrics.maxHistoryBufferLength.
     * @param {PerformanceState} measurements
     */
    #storeMeasurements( measurements ) {
        this.#history.push(measurements);
        if (this.#history.length > 256) {
            this.#history.splice(0, 1);
        }
        localStorage.setItem("PerformanceMetrics", JSON.stringify(this.#history));
    }

    /**
     * Take measurements of all performance metrics.
     * @returns {PerformanceState} Timestamped object containing performance data.
     */
    measurePerformance() {
        let measurements = new PerformanceState();
        for (let [key, metric] of Object.entries(this.#metrics)) {
            // metric.rate/.timer not finished.
            // if (metric.timer < metric.rate) {
                measurements.data[key] = metric.measurePerformance();
                // metric.timer = 0;
            // } else {
                // metric.timer += 1;
            // }
        }
        this.#storeMeasurements(measurements);
        return measurements;
    }

    /**
     * Compute all performance metrics taking the history buffer into account.
     * @returns {PerformanceState} Timestamped object containing performance data.
     */
    computeTrends() {
        let trends = new PerformanceState();

        for (let [key, metric] of Object.entries(this.#metrics)) {
            let metricHistory = [];
            for (let measurement of this.#history) {
                // Undefined if metric did not exist when history was written to localStorage.
                if (measurement.data[key] === undefined) {
                    continue;
                }
                metricHistory.push(measurement.data[key]);
            }

            trends.data[key] = metric.computeTrends(metricHistory);
        }
    
        return trends;
    }

    /**
     * Print performance measurements in a nicely formatted way.
     * @param {PerformanceState} measurement
     * @throws {Error} If measurement is not an instance of PerformanceState.
     */
    printMeasurement( measurement ) {
        if (!(measurement instanceof PerformanceState)) {
            throw Error(
                `measurement must be an instance of PerformanceState!`
            );
        }

        console.group(`Performance Measurements (${new Date(measurement.date).toLocaleString()})\n`);
        for (let [key, metric] of Object.entries(this.#metrics)) {
            metric.printMeasurement(measurement.data[key]);
        }
        console.groupEnd();
    }

    /**
     * Print performance trends in a nicely formatted way.
     * @param {PerformanceState} trends
     * @throws {Error} If trends is not an instance of PerformanceState.
     */
    printTrends( trends ) {
        if (!(trends instanceof PerformanceState)) {
            throw Error(
                `trends must be an instance of PerformanceState!`
            );
        }

        let t0 = new Date(this.#history[0].date).toLocaleString();
        let t1 = new Date(this.#history[this.#history.length-1].date).toLocaleString();

        console.group(`Performance Trends (${t0} to ${t1})`);
        for (let [key, metric] of Object.entries(this.#metrics)) {
            metric.printTrends(trends.data[metric.constructor.name]);
        }
        console.groupEnd();
    }

}





class MetricGroupVsArray extends MetricBase {
    /**
     * @typedef {Object} _DataPoint
     * @property {string} title Title text.
     * @property {string} body Body text.
     * @property {number} numColliders Number of colliders used.
     * @property {number} numFrames  Number of frames averaged over.
     * @property {number} msGroupCollide Time elapsed in milliseconds.
     * @property {number} msGroupOverlap Time elapsed in milliseconds.
     * @property {number} msArrayCollide Time elapsed in milliseconds.
     * @property {number} msArrayOverlap Time elapsed in milliseconds.
     */

    constructor( numColliders = [4, 8, 16, 32, 64, 128, 256], numFrames = 32 ) {
        super();
        this.numColliders = numColliders;
        this.numFrames    = numFrames;
    }

    #createDataPoint( title, body, numColliders, numFrames, msGroupCollide, msGroupOverlap,
                      msArrayCollide, msArrayOverlap ) {
        return {
            title: title,
            body: body,
            numColliders: numColliders, numFrames: numFrames,
            msGroupCollide: msGroupCollide, msGroupOverlap: msGroupOverlap,
            msArrayCollide: msArrayCollide, msArrayOverlap: msArrayOverlap
        };
    }

    /**
     * @param {Array} positions
     */
    #createColliders( positions ) {
        let balls = $.makeGroup();
        let walls = $.makeGroup();

        for (let i=0; i<positions.length; i++) {
            balls.push($.makeCircleCollider( positions[i].x, positions[i].y, 16));
        }

        const R0 = $.makeBoxCollider(10, $.h/2, 20, $.h);      R0.static = true;
        const R1 = $.makeBoxCollider($.w-10, $.h/2, 20, $.h);  R1.static = true;
        const R2 = $.makeBoxCollider($.w/2, 10, $.w, 20);      R2.static = true;
        const R3 = $.makeBoxCollider($.w/2, $.h-10, $.w, 20);  R3.static = true;
        walls.push(R0, R1, R2, R3);

        return [balls, walls];
    }

    /**
     * @param {Group} balls
     * @param {Group} walls
     */
    #destoryColliders( balls, walls ) {
        for (let ball of balls) { ball.remove(); }
        for (let wall of walls) { wall.remove(); }
    }

    /**
     * @param numColliders Number of colliders.
     * @param numFrames Number of frames.
     * @returns {_DataPoint} Performance measurement
     */
    #makeMeasurement( numColliders, numFrames ) {
        const positions = [];
        for (let i=0; i<numColliders; i++) {
            positions.push({
                x: $.math.random(0, $.w),
                y: $.math.random(0, $.h)
            });
        }
        const measureTime = (numFrames, work) => {
            const [balls, walls] = this.#createColliders(positions);

            const t0 = performance.now();
            work(balls, walls);
            const t1 = performance.now();

            this.#destoryColliders(balls, walls);
            return t1-t0;
        };

        const msGroupCollide = measureTime(numFrames, (balls, walls) => {
            balls.collides(balls);
            balls.collides(walls);
        });

        const msGroupOverlap = measureTime(numFrames, (balls, walls) => {
            balls.overlaps(balls);
            balls.overlaps(walls);
        });

        const msArrayCollide = measureTime(numFrames, (balls, walls) => {
            for (let ball1 of balls) {
                for (let ball2 of balls) { ball1.collides(ball2); }
                for (let wall of walls)  { ball1.collides(wall);  }
            }
        });

        const msArrayOverlap = measureTime(numFrames, (balls, walls) => {
            for (let ball1 of balls) {
                for (let ball2 of balls) { ball1.overlaps(ball2); }
                for (let wall of walls)  { ball1.overlaps(wall);  }
            }
        });


        return this.#createDataPoint(
            "", "", numColliders, numFrames,
            msGroupCollide, msGroupOverlap,
            msArrayCollide, msArrayOverlap
        );
    }

    /**
     * Add title and body text to _DataPoint object.
     * @param {_DataPoint} M  Measurement object without title and body text
     * @return {_DataPoint} Measurement object with title and body text.
    */
    #fillTitleAndBody( M ) {
        const maxCollide = Math.max(M.msArrayCollide, M.msGroupCollide);
        const minCollide = Math.min(M.msArrayCollide, M.msGroupCollide);
        const maxOverlap = Math.max(M.msArrayOverlap, M.msGroupOverlap);
        const minOverlap = Math.min(M.msArrayOverlap, M.msGroupOverlap);
        const ratioCollide = (minCollide / maxCollide).toFixed(2);
        const ratioOverlap = (minOverlap / maxOverlap).toFixed(2);
    
        let fasterCollide = "group";
        let slowerCollide = "array";
        let fasterOverlap = "group";
        let slowerOverlap = "array";

        if (M.msArrayCollide < M.msGroupCollide) {
            fasterCollide = "array";
            slowerCollide = "group";
        }

        if (M.msArrayOverlap < M.msGroupOverlap) {
            fasterOverlap = "array";
            slowerOverlap = "group";
        }


        let msgTitle = "";

        if (fasterCollide == "group" && fasterOverlap == "group") {
            msgTitle = "Group is faster";
        } else if (fasterCollide == "array" && fasterOverlap == "array") {
            msgTitle = "Array is faster";
        } else {
            msgTitle = "Mixed results";
        }

        M.title = `[${M.numColliders} colliders]: ${msgTitle}`;
        M.body  = `Performance cost of ${M.numColliders} colliders averaged over ${M.numFrames} frames:\n`
                + `- ${fasterCollide} .collides takes ${ratioCollide}x the time of ${slowerCollide} .collides.\n`
                + `- ${fasterOverlap} .overlaps takes ${ratioOverlap}x the time of ${slowerOverlap} .overlaps.\n`;

        return M;
    }

    /**
     * Generate a table from a _DataPoint object.
     * @param {_DataPoint} M Measurement object.
     * @return {Array<Object>} Data table. 
    */
    #createTable( M ) {
        const createRow = (name, totalRuntime, avgRuntime) => {
            return {Method: name, "Total runtime (ms)": totalRuntime, "Avg. (ms)": avgRuntime};
        }

        return [
            createRow("Group .collides", M.msGroupCollide, M.msGroupCollide/M.numFrames),
            createRow("Group .overlaps", M.msGroupOverlap, M.msGroupOverlap/M.numFrames),
            createRow("Array .collides", M.msArrayCollide, M.msArrayCollide/M.numFrames),
            createRow("Array .overlaps", M.msArrayOverlap, M.msArrayOverlap/M.numFrames)
        ];
    }

    /**
     * @returns {{measurements: Array<_DataPoint>}}
     */
    measurePerformance() {
        const data = [];
        const frames = this.numFrames;
    
        for (const colliders of this.numColliders) {
            let M = this.#makeMeasurement(colliders, frames);
                M = this.#fillTitleAndBody(M);
            data.push(M);
        }

        return {measurements: data};
    }

    /**
     * @param {Array<{measurements: Array<_DataPoint>}>} history
     * @returns {{measurements: Array<_DataPoint>}} trends
    */
    computeTrends( history ) {
        let totals = {};
        let counts = {};

        for (let data of history) {
            for (let M of data.measurements) {
                if (totals[M.numColliders] === undefined) {
                    totals[M.numColliders] = this.#createDataPoint("", "", 0, 0, 0, 0, 0, 0);
                    counts[M.numColliders] = 0;
                }

                let total = totals[M.numColliders];
                counts[M.numColliders] += 1;

                total.numColliders   += M.numColliders;
                total.numFrames      += M.numFrames;
                total.msGroupCollide += M.msGroupCollide;
                total.msGroupOverlap += M.msGroupOverlap;
                total.msArrayCollide += M.msArrayCollide;
                total.msArrayOverlap += M.msArrayOverlap;
            }
        }


        let data = [];

        for (let key in totals) {
            let avg   = totals[key];
            let count = counts[key];
            avg.numColliders /= count;
            avg = this.#fillTitleAndBody(avg);
            data.push(avg);
        }

        return {measurements: data};
    }

    /**
     * @param {{measurements: Array<_DataPoint>}} data 
     */
    printMeasurement( data ) {
        console.groupCollapsed(`Group vs Array .collides/.overlaps`);

        for (const M of data.measurements) {
            console.groupCollapsed(M.title);
                console.log(M.body);
                console.table(this.#createTable(M));
            console.groupEnd();
        }

        console.groupEnd();
    }

    /**
     * @param {{measurements: Array<_DataPoint>}} trends 
     */
    printTrends( trends ) {
        console.groupCollapsed(`Group vs Array .collides/.overlaps`);
        const measurements  = trends.measurements;

        for (let M of measurements) {
            console.groupCollapsed(`${M.title}`);
            console.log(M.body);
            console.table(this.#createTable(M));
            console.groupEnd();
        }
        console.groupEnd();
    }
}

 


/**
 * Simple example metric which measures framerate.
 */
class MetricFramerate extends MetricBase {
    constructor() {
        super();
    }

    /**
     * @returns {{framerate: number}}
     */
    measurePerformance() {
        return {framerate: 32};
    }

    /**
     * @param {Array<{framerate: number}>} history
     * @returns {{framerate: number}} trends
     */
    computeTrends( history ) {
        let avg = 0;

        for (let data of history) {
            avg += data.framerate;
        }
        avg /= history.length;

        return {historyLength: history.length, framerate: avg};
    }

    /**
     * @param {{framerate: number}} measurement 
     */
    printMeasurement( measurement ) {
        console.groupCollapsed("Framerate");
        console.log(`Framerate: ${measurement.framerate}`);
        console.groupEnd();
    }

    /**
     * @param {{historyLength: number, framerate: number}} trends 
     */
    printTrends( trends ) {
        console.groupCollapsed("Framerate");
        console.log(`Framerate: ${trends.framerate}`);
        console.groupEnd();
    }
}
