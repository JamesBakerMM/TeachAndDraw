import { $ } from "./Pen.js";


/**
 * @typedef {Object} Metric
 * @property {Function} computeResults
 * @property {Function} printResults
 * @property {number} numFrames
 * @property {string} title
 * @property {string} body
 * @property {Array<Object>} table
 */


/**
 * @property {number} cacheLifetimeHours "PerformanceMetrics" will be cleared from
 * @property {number} cacheLifetimeMinutes
 * @property {boolean} isCached
 * @property {Date} dateCached
 * @property {Array<Metric>} metrics
 * localStorage after cacheLifetimeHours hours and cacheLifetimeMinutes minutes.
 *
 */
export class PerformanceMetrics {

    /** @type {Array<Metric>} */
    #metrics;

    static cacheLifetimeHours   = 30;
    static cacheLifetimeMinutes = 30;

    constructor() {

        this.#metrics = [
            new MetricColliderGroupVsArray(),
            new MetricSomethingElse()
        ];
    }


    /**
     * @param {number} frames Number of frames to run work for. 
     * @param {Function} work Work to be timed.
     * @returns {number} Milliseconds elapsed.
     */
    static measureTime( frames=1, work ) {
        const A = performance.now();
        for (let i=0; i<frames; i++) {
            $.upkeep();
            work();
            $.downkeep();
        }
        return performance.now() - A;
    }


    /**
     * @returns {boolean}
     */
    #cacheIsExpired() {
        let json = localStorage.getItem("PerformanceMetrics");
        if (json === null) {
            return false;
        }

        const cached = JSON.parse(json);
        const t0 = new Date(cached.dateCached)
        const t1 = new Date();
        const minutes = Math.abs(t1.getMinutes() - t0.getMinutes());

        return (minutes > this.cacheLifetimeMinutes);
    }



    #saveResults( results ) {
        localStorage.setItem("PerformanceMetrics", JSON.stringify(results));
        this.dateCached = new Date();
    }

    /**
     * @returns {Object | null} Array of metrics.
     */
    #loadResults() {
        const json = localStorage.getItem("PerformanceMetrics");
        if (json === null) {
            return null;
        }
        return JSON.parse(json);
    }

    /**
     * @returns {Object}
     */
    #computeResults() {
        let results = {};
        for (let metric of this.#metrics) {
            results[metric.constructor.name] = metric.computeResults();
        }
        return results;
    }

    /**
     * @returns {Object}
     */
    computeResults() {
        localStorage.clear();

        let results = this.#loadResults();

        if (results === null || this.#cacheIsExpired()) {
            results = this.#computeResults();
            this.#saveResults(results);
        }

        return results;
    }

    /**
     * @param {Object} results
     */
    printResults( results ) {
        console.group(`Performance Metrics (cached ${new Date(this.dateCached).toLocaleTimeString()})\n`);
        for (let metric of this.#metrics) {
            console.groupCollapsed(`${metric.constructor.name}`);
            metric.printResults(results[metric.constructor.name]);
            console.groupEnd();
        }
        console.groupEnd();
    }
}




class MetricColliderGroupVsArray {
    /**
     * @typedef {Object} ColliderGroupVsArrayResultSummary
     * @property {number} numColliders
     * @property {number} numFrames
     * @property {string} title
     * @property {string} body
     * @property {Array<Object>} table
     */

    /**
     * @typedef {Object} ColliderGroupVsArrayResult
     * @property {ColliderGroupVsArrayResultSummary} summary
     * @property {Array<Array<number>>} data
     * @property {Array<number>} msGroupsCollide
     * @property {Array<number>} msGroupsOverlap
     * @property {Array<number>} msArraysCollide
     * @property {Array<number>} msArraysOverlap
     */

    constructor( numColliders = [4, 6, 8, 12, 32, 64, 256], numFrames = [32] ) {
        this.numColliders = numColliders;
        this.numFrames    = numFrames;
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

    #destoryColliders( balls, walls ) {
        for (let ball of balls) { ball.remove(); }
        for (let wall of walls) { wall.remove(); }
    }

    /**
     * @param numColliders Number of colliders.
     * @param numFrames Number of frames.
     * @returns {Array} [msGroupsCollide, msGroupsOverlap, msArraysCollide, msArraysOverlap].
     */
    #compute( numColliders, numFrames ) {
        const positions = [];
        for (let i=0; i<numColliders; i++) {
            positions.push({
                x: $.math.random(0, $.w),
                y: $.math.random(0, $.h)
            });
        }
        const measureTime = (numFrames, work) => {
            const [balls, walls] = this.#createColliders(positions);

            const A = performance.now();
            for (let i=0; i<numFrames; i++) {
                $.upkeep();
                work(balls, walls);
                $.downkeep();
            }
            const time = performance.now() - A;

            this.#destoryColliders(balls, walls);
            return time;
        };

        const T0 = measureTime(numFrames, (balls, walls) => {
            balls.collides(balls);
            balls.collides(walls);
        });

        const T1 = measureTime(numFrames, (balls, walls) => {
            balls.overlaps(balls);
            balls.overlaps(walls);
        });

        const T2 = measureTime(numFrames, (balls, walls) => {
            for (let ball1 of balls) {
                for (let ball2 of balls) { ball1.collides(ball2); }
                for (let wall of walls)  { ball1.collides(wall);  }
            }
        });

        const T3 = measureTime(numFrames, (balls, walls) => {
            for (let ball1 of balls) {
                for (let ball2 of balls) { ball1.overlaps(ball2); }
                for (let wall of walls)  { ball1.overlaps(wall);  }
            }
        });

        return [T0, T1, T2, T3];
    }

    /**
     * @param {ColliderGroupVsArrayResult} result 
     * @param {number} i 
     * @param {number} j 
     */
    #generateTitle(result, i, j) {
        let msg = "";
        const c0 = (result.msGroupsCollide[i][j] < result.msArraysCollide[i][j]);
        const c1 = (result.msGroupsOverlap[i][j] < result.msArraysOverlap[i][j]);

        if (c0 && c1) {
            msg += "Group is faster than array";
        } else if (!c0 && !c1) {
            msg += "Array is faster than group";
        } else {
            msg += "Group/Array are roughly the same speed";
        }

        return msg;
    }

    /**
     * @param {ColliderGroupVsArrayResult} result 
     * @param {number} i 
     * @param {number} j 
     */
    #generateBody(result, i, j) {
        const msCollideMax = Math.max(result.msArraysCollide[i][j], result.msGroupsCollide[i][j]);
        const msCollideMin = Math.min(result.msArraysCollide[i][j], result.msGroupsCollide[i][j]);
        const msOverlapMax = Math.max(result.msArraysOverlap[i][j], result.msGroupsOverlap[i][j]);
        const msOverlapMin = Math.min(result.msArraysOverlap[i][j], result.msGroupsOverlap[i][j]);
        const ratioCollide = (msCollideMin / msCollideMax).toFixed(2);
        const ratioOverlap = (msOverlapMin / msOverlapMax).toFixed(2);

        let msgCollide = "";
        let msgOverlap = "";

        if (result.msArraysCollide[i][j] > result.msGroupsCollide[i][j]) {
            msgCollide = `- group.collides takes ${ratioCollide}x as long as nested loop .collides.`;
        } else {
            msgCollide = `- Nested loop .collides takes ${ratioCollide}x as long as group.collides.`;
        }

        if (result.msArraysOverlap[i][j] > result.msGroupsOverlap[i][j]) {
            msgOverlap = `- group.overlaps takes ${ratioOverlap}x as long as nested loop .overlaps.`;
        } else {
            msgOverlap = `- Nested loop .overlaps takes ${ratioOverlap}x as long as group.overlaps.`;
        }
    
        return `${msgCollide}\n${msgOverlap}\n`;
    }

    /**
     * @param {ColliderGroupVsArrayResult} result 
     * @param {number} i 
     * @param {number} j 
     */
    #generateTable(result, i, j) {
        const genrow = (name, ms, ratio, cidx, fidx) => {
            return { "Method": name, "Total runtime (ms)": ms[cidx][fidx], 
                "ms/frame": ms[cidx][fidx] / this.numFrames[fidx],
                "Ratio": `${ratio.toFixed(2)}x`
            };
        }

        const ratios = [
            result.msGroupsCollide[i][j] / result.msArraysCollide[i][j],
            result.msArraysCollide[i][j] / result.msGroupsCollide[i][j],
            result.msGroupsOverlap[i][j] / result.msArraysOverlap[i][j],
            result.msArraysOverlap[i][j] / result.msGroupsOverlap[i][j],
        ];

        return [
            genrow("group.collides(group)",        result.msGroupsCollide, ratios[0], i, j),
            genrow("nested loop .collides(other)", result.msArraysCollide, ratios[1], i, j),
            genrow("group.overlaps(group)",        result.msGroupsOverlap, ratios[2], i, j),
            genrow("nested loop .overlaps(other)", result.msArraysOverlap, ratios[3], i, j)
        ];
    }

    /**
     * @returns {ColliderGroupVsArrayResult}
     */
    computeResults() {
        let result = {
            summary: [],
            data: [[], [], [], []]
        };

        result.msGroupsCollide = result.data[0];
        result.msGroupsOverlap = result.data[1];
        result.msArraysCollide = result.data[2];
        result.msArraysOverlap = result.data[3];

        for (let i=0; i<this.numColliders.length; i++) {
            for (let j=0; j<4; j++) {
                result.data[j].push([]);
            }

            for (let j=0; j<this.numFrames.length; j++) {
                const res = this.#compute(this.numColliders[i], this.numFrames[j]);
                result.msGroupsCollide[i].push(res[0]);
                result.msGroupsOverlap[i].push(res[1]);
                result.msArraysCollide[i].push(res[2]);
                result.msArraysOverlap[i].push(res[3]);
            }
        }

        for (let i=0; i<this.numColliders.length; i++) {
            for (let j=0; j<this.numFrames.length; j++) {
                result.summary.push({
                    numColliders: this.numColliders[i],
                    numFrames: this.numFrames[j],
                    title: this.#generateTitle(result, i, j),
                    body: this.#generateBody(result, i, j),
                    table: this.#generateTable(result, i, j)
                });
            }
        }

        return result;
    }

    /**
     * @param {ColliderGroupVsArrayResult} result 
     */
    printResults( result ) {
        for (let bruh of result.summary) {
            console.groupCollapsed(`${bruh.numColliders} colliders. ${bruh.title}.\n`);
            console.log(bruh.body);
            console.table(bruh.table);
            console.groupEnd();
        }
    }
}







/**
 * Just an example
 */
class MetricSomethingElse {
    /**
     * @typedef {Object} SomethingElseResult
     * @property {number} cost
     * @property {number} return
     */
    constructor() {  }

    /**
     * @returns {SomethingElseResult}
     */
    computeResults() {
        let result = {
            cost: $.math.random(0, 100),
            return: $.math.random(0, 100)
        };

        return result;
    }

    /**
     * 
     * @param {SomethingElseResult} result 
     */
    printResults( result ) {
        console.log(
            `Cost ${result.cost}\n`,
            `Return ${result.return}\n`,
        );
    }
}

