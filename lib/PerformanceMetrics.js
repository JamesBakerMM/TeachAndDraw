// @ts-nocheck
import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Group } from "./Group.js";
import { $ } from "./TeachAndDraw.js";

/**
 * @template T
 * @property {Date} date Date/time the data was measured/computed.
 * @property {T} data The measured/computed data.
 */
class MetricData {
    /**
     * @param {T | null} data 
     */
    constructor( data = null ) {
        this.date = new Date();
        this.data = data;
    }
}


/**
 * @property {number} delay Number of frames between each measurement.
 * @property {number} timer Timer which tracks number of frames since last measurement.
 * @property {boolean} enabled
 */
export class MetricBase {
    #delay = 64;
    timer = 0;
    enabled = true;

    /**
     * @param {number} delay Desired delay between measurements in frames. takeMeasurements will
     * be called every delay frames.
     * @throws {Error} If delay is not a finite number.
     */
    set delay( delay ) {
        if (delay <= 0 || Number.isFinite(delay) == false) {
            throw Error(
                ErrorMsgManager.numberCheckFailed(
                    delay, `delay must be a finite, positive number!`
                )
            );
        }
        this.#delay = delay;
    }
    
    /**
     */
    get delay() {
        return this.#delay;
    }

    /** Make a performance measurement.
     * @template T
     * @returns {MetricData<T>} Performance measurement.
     */
    takeMeasurements() { throw Error("Derived class must define takeMeasurements!"); };

    /** Compute trend data from the history buffer.
     * @template T
     * @param {Array<MetricData<T>>} history
     * @returns {MetricData<T>}
     */
    computeTrends( history ) { throw Error("Derived class must define computeTrends!"); };

    /** Print measurement data in a nicely-formatted way.
     * @template T
     * @param {MetricData<T>} data
     */
    printMeasurements( data ) { throw Error("Derived class must define printMeasurements!"); };

    /** Print trend data in a nicely-formatted way.
     * @template T
     * @param {MetricData<T>} data
     */
    printTrends( data ) { throw Error("Derived class must define printTrends!"); };
}


/**
 * @property {number} historyBufferMaxLength Maximum number of performance measurements to keep
 * in local storage.
 */
export class PerformanceMetrics {
    static historyBufferMaxLength = 512;
    static localStorageKey = "PerformanceMetrics";

    trendDelay  = 2048;
    #trendTimer = 0;

    /**
     * Stores an instance of each performance metric.
     * Maps metric name --> metric.
     * @type {Object}
    */
    #metrics;

    /**
     * Stores the last measured data of each performance metric.
     * Maps metric name --> measured data.
     * @type {Object}
    */
    #measurements;

    /**
     * Stores the last computed trend data of each performance metric.
     * Maps metric name --> trend data.
     * @type {Object}
    */
    #trends;


    /**
     * History buffer which stores the result of the previous historyBufferMaxLength calls to
     * PerformanceMetrics.takeMeasurements. Loaded from localStorage if exists, otherwise
     * initialized to an empty object.
     * Maps metric name --> Array<metric data>.
     * @type {Object} 
    */
    #historyBuffers;
    #tad
    
    constructor(tad) {
        this.#tad=tad;
        this.#metrics = {};
        // this.addMetric(new MetricGroupVsArray());
        // this.addMetric(new MetricFramerate());

        this.#trends = {};
        this.#measurements = {};

        // localStorage.clear();
        const json = localStorage.getItem(PerformanceMetrics.localStorageKey);
        if (json === null) {
            this.#historyBuffers = {};
        } else {
            this.#historyBuffers = JSON.parse(json);
        }
    }

    /**
     * Add a performance metric.
     * This exists so other parts of the libary can define their own metrics privately.
     * Some metrics may be too expensive to measure every frame or only need to be measured
     * once (like MetricGroupVsArray). These metrics could be added to take measurements before
     * being removed after some time.
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

    /**
     * Remove a performance metric.
     * This exists so other parts of the libary can define their own metrics privately.
     * Some metrics may be too expensive to measure every frame or only need to be measured
     * once (like MetricGroupVsArray). These metrics could be added to take measurements before
     * being removed after some time.
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
     * Push performance measurement onto a metric's history buffer and write it to localStorage.
     * The first element of the history buffer will be removed if its length exceeds
     * PerformanceMetrics.historyBufferMaxLength.
     * @template T
     * @param {string} key 
     * @param {MetricData<T>} measurement 
     */
    #pushMeasurement( key, measurement ) {
        if (this.#historyBuffers[key] === undefined) {
            this.#historyBuffers[key] = [];
        }

        this.#historyBuffers[key].push(measurement);

        if (this.#historyBuffers[key].length > PerformanceMetrics.historyBufferMaxLength) {
            this.#historyBuffers[key].splice(0, 1);
        }
    }

    /**
     * Write history buffer to localStorage.
     */
    #storeHistory() {
        localStorage.setItem(PerformanceMetrics.localStorageKey, JSON.stringify(this.#historyBuffers));
    }

    /**
     * Take measurements of all performance metrics.
     * @returns {Object} Object containing map of metric name to data.
     */
    takeMeasurements() {
        for (let [key, metric] of Object.entries(this.#metrics)) {
            if (metric === undefined || metric.enabled == false) {
                continue;
            }
            if (metric.timer < metric.delay-1) {
                metric.timer += 1;
                continue;
            } else {
                metric.timer = 0;
            }

            let md = metric.takeMeasurements();
            this.#pushMeasurement(key, md);
            this.#measurements[key] = md;
        }

        return this.#measurements;
    }

    /**
     * Compute all performance metrics taking the history buffer into account.
     * @returns {MetricData} Timestamped object containing performance data.
     */
    computeTrends() {
        for (let [key, metric] of Object.entries(this.#metrics)) {
            if (metric === undefined || metric.enabled == false) {
                continue;
            }
            // No measurements taken yet.
            if (this.#historyBuffers[key] == undefined) {
                continue;
            }

            this.#trends[key] = metric.computeTrends(this.#historyBuffers[key]);
        }

        return this.#trends;
    }

    /**
     * Print measured data in a nicely formatted way.
     * @param {Object} data
     */
    printMeasurements( data ) {
        if (data == null) {
            return;
        }
        if (Object.entries(data).length == 0) {
            return;
        }

        console.group(`Performance Measurements`);

        for (let [key, dummy] of Object.entries(data)) {
            const metric = this.#metrics[key];
            console.groupCollapsed(key);
            metric.printMeasurements(data[key]);
            console.groupEnd();
        }

        console.groupEnd();
    }

    /**
     * Print trend data in a nicely formatted way.
     * @param {Object} data
     */
    printTrends( data = this.#trends ) {
        if (data == null) {
            return;
        }
        if (Object.entries(data).length == 0) {
            return;
        }

        console.group(`Performance Trends`);
    
        for (let [key, dummy] of Object.entries(data)) {
            const metric = this.#metrics[key];
            if (metric === undefined) {
                continue;
            }

            let t0 = this.#historyBuffers[key][0].date;
            let t1 = this.#historyBuffers[key][this.#historyBuffers[key].length-1].date;
            t0 = new Date(t0).toLocaleString();
            t1 = new Date(t1).toLocaleString();

            console.groupCollapsed(`${key} (${t0} to ${t1})`);
            metric.printTrends(data[key]);
            console.groupEnd();
        }

        console.groupEnd();
    }

    update() {
       this.takeMeasurements();

        if (this.#trendTimer < this.trendDelay-1) {
            this.#trendTimer += 1;
        } else {
            this.#trendTimer = 0;
            this.computeTrends();

            if (Object.entries(this.#trends).length > 0) {
                this.#storeHistory();
            }
        }
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

    constructor( numColliders = [4, 16, 64, 256], numFrames = 32 ) {
        super();
        this.delay = 1024; // Metric disables itself after first call to .computeTrends.
        this.numColliders = numColliders;
        this.numFrames = numFrames;
    }

    /**
     * @param {any} title
     * @param {any} body
     * @param {any} numColliders
     * @param {any} numFrames
     * @param {any} msGroupCollide
     * @param {any} msGroupOverlap
     * @param {any} msArrayCollide
     * @param {any} msArrayOverlap
     */
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
     * @param {Array<Object>} positions
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
     * @param {number} numColliders Number of colliders.
     * @param {number} numFrames Number of frames.
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
            for (let i=0; i<numFrames; i++) {
                $.upkeep();
                work(balls, walls);
                $.downkeep();
            }
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
                + `- ${fasterCollide} .collides completes in ${ratioCollide}x the time of ${slowerCollide} .collides.\n`
                + `- ${fasterOverlap} .overlaps completes in ${ratioOverlap}x the time of ${slowerOverlap} .overlaps.\n`;

        return M;
    }

    /**
     * Generate a table from a _DataPoint object.
     * @param {_DataPoint} M Measurement object.
     * @return {Array<Object>} Data table. 
    */
    #createTable( M ) {
        const createRow = (name, totalRuntime, avgRuntime) => {
            return {Method: name, "Total runtime (ms)": totalRuntime, "Avg. runtime (ms)": avgRuntime};
        }

        return [
            createRow("Group .collides", M.msGroupCollide, M.msGroupCollide/M.numFrames),
            createRow("Group .overlaps", M.msGroupOverlap, M.msGroupOverlap/M.numFrames),
            createRow("Array .collides", M.msArrayCollide, M.msArrayCollide/M.numFrames),
            createRow("Array .overlaps", M.msArrayOverlap, M.msArrayOverlap/M.numFrames)
        ];
    }

    /**
     * @returns {MetricData<_DataPoint>}
     */
    takeMeasurements() {
        const data = [];
        const frames = this.numFrames;
    
        for (const colliders of this.numColliders) {
            let M = this.#makeMeasurement(colliders, frames);
                M = this.#fillTitleAndBody(M);
            data.push(M);
        }

        return new MetricData(data);
    }

    /**
     * @param {Array<MetricData<Array<_DataPoint>>>} history
     * @returns {MetricData<Array<_DataPoint>>}
    */
    computeTrends( history ) {
        let totals = {};
        let counts = {};

        for (let state of history) {
            for (let M of state.data) {
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


        let data = []

        for (let key in totals) {
            let avg   = totals[key];
            let count = counts[key];
            avg.numColliders /= count;
            avg = this.#fillTitleAndBody(avg);
            data.push(avg);
        }


        this.enabled = false;

        return new MetricData(data);
    }

    /**
     * @param {MetricData<_DataPoint>} data 
     */
    printMeasurements( data ) {
        // console.groupCollapsed(`Group vs Array .collides/.overlaps`);

        for (const M of data.data) {
            console.groupCollapsed(M.title);
                console.log(M.body);
                console.table(this.#createTable(M));
            console.groupEnd();
        }

        // console.groupEnd();
    }

    /**
     * @param {MetricData<_DataPoint>} data 
     */
    printTrends( data ) {
        // console.groupCollapsed(`Group vs Array .collides/.overlaps`);
        for (let M of data.data) {
            console.groupCollapsed(`${M.title}`);
                console.log(M.body);
                console.table(this.#createTable(M));
            console.groupEnd();
        }
        // console.groupEnd();
    }
}

 


/**
 * Simple example metric which measures framerate.
 */
class MetricFramerate extends MetricBase {
    constructor() {
        super();
        this.delay = 4;
    }

    /**
     * @returns {MetricData<number>}
     */
    takeMeasurements() {
        return new MetricData($.time.fps);
    }

    /**
     * @param {Array<MetricData<number>>} history
     * @returns {MetricData<Array<number>>}
     */
    computeTrends( history ) {
        let avg = 0;
        let min = Infinity;
        let max = 0;

        for (let data of history) {
            avg += data.data;
            min = Math.min(min, data.data);
            max = Math.max(max, data.data);
        }
        avg /= history.length;

        return new MetricData([avg, min, max]);
    }

    /**
     * @param {MetricData<number>} data 
     */
    printMeasurements( data ) {
        console.log(`Framerate: ${data.data}`);
    }

    /**
     * @param {MetricData<number>} data 
     */
    printTrends( data ) {
        console.log(`Avg. Framerate: ${data.data[0]}`);
        console.log(`Min. Framerate: ${data.data[1]}`);
        console.log(`Max. Framerate: ${data.data[2]}`);
    }
}
