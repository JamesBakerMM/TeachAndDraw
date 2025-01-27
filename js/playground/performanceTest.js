import { $ } from "../../lib/TeachAndDraw.js";
import { MetricBase } from "../../lib/PerformanceMetrics.js";


// Example performance metric
// -------------------------------------------------
class MetricTest extends MetricBase {
    takeMeasurements() {
        return {date: new Date(), data: $.math.random(0, 100)};
    };

    computeTrends( history ) {
        let avg = 0;

        for (let data of history) {
            avg += data.data
        }

        avg /= history.length;

        return {date: new Date(), data: avg};
    };

    printMeasurements( data ) {
        console.log(`Value: ${data.data}`);
    };

    printTrends( data ) {
        this.printMeasurements(data);
    };
}

$.performanceMetrics.addMetric(new MetricTest());
// -------------------------------------------------




$.debug = true;
$.use(update);
$.width  = 512;
$.height = 512;


let count = 0;

function update() {
    if (count >= 2048) {
        $.performanceMetrics.printMeasurements();
        $.performanceMetrics.printTrends();
        count = 0;
    }
    count += 1;
}
