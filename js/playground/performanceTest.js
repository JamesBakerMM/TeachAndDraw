import { $ } from "../../lib/Pen.js";
import { MetricBase } from "../../lib/PerformanceMetrics.js";


// Example performance metric.
// -------------------------------------------------
class MetricTest extends MetricBase {
    measurePerformance() {
        return {value: $.math.random(0, 100)};
    };

    computeTrends( history ) {
        let avg = 0;

        for (let data of history) {
            avg += data.value
        }

        avg /= history.length;

        return {value: avg};
    };

    printMeasurement( measurement ) {
        console.groupCollapsed("Test Metric");
        console.log(`Value: ${measurement.value}`);
        console.groupEnd("Test Metric");
    };

    printTrends( trends ) {
        this.printMeasurement(trends);
    };
}

$.performanceMetrics.addMetric(new MetricTest());
// -------------------------------------------------




$.debug = true;
$.use(update);
$.width  = 512;
$.height = 512;


function update() {

}
